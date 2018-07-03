import shortId from 'shortid';
import {
  SEARCH_BY_ITEMS_START, SEARCH_BY_ITEMS_SET_INDEX, SEARCH_BY_ITEMS_END,
  SEARCH_BY_ITEMS_TERMINATE, SEARCH_BY_ITEMS_REQUEST,
} from 'constants/actionTypes';
import { AUTH_FAILED } from 'constants/api'; // TODO: pass with options ?
import {
  getAccessToken, getCurrentItemIndex, getRequestsById,
  getSearchByItemsFailed, getSearchByItemsPending, getSearchByItemsErrorCode,
} from 'selectors';
// import fetchJSONP from 'utils/fetchJSONP';
import jsonpPromise from 'utils/jsonpPromise';
import { onSuccess, onFail } from './requestHandlers';
// import transformResponse from './transformResponse';
// import {
//   validateAction, validateOffsetModifier, validateOptions, validateParams
// } from './validation';

export const SEARCH_BY_ITEMS = 'SEARCH::BY::ITEMS';

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: not repeat pending, just make them failed instead; Belated Overdue
// const checkAndRepeatFailed = () => {}

// TODO: middleware factory
// export default function createSearchByItemsMiddleware(apiClient, options) {
//   const { offsetModifier, requestInterval = 350, maxAttempts = 5 } = options;
//
//   validateOffsetModifier(offsetModifier);
//
//   return searchByItems;
// }

const searchByItems = ({ dispatch, getState }) => {
  let intervalId; // TODO: replace to top
  // const search = {
  //   isActive: false,
  //   offset: 0
  //   total: undefined, // total amount of items to search among
  //   processed: 0,
  // };

  // const requests = {
  //   'offset_400': {
  //     id: 'offset_400'
  //     offset: 400,
  //     attempt: 1, // how many times request was sent/sent again
  //     isPending: true, // failed request will get "false" value here
  //   }
  // };

  return next => (action) => {
    // TODO: destructure from action callAPI and transformResponse functions with
    // imported defaults
    const { type, types, getNumberOfResults } = action;
    const searchParams = action[SEARCH_BY_ITEMS];

    if (
      typeof searchParams === 'undefined' && type !== SEARCH_BY_ITEMS_TERMINATE
    ) {
      return next(action);
    }
    if (!types && type !== SEARCH_BY_ITEMS_TERMINATE) {
      return next(action);
    }
    if (type === SEARCH_BY_ITEMS_TERMINATE) {
      clearInterval(intervalId);
      return next(action); // TODO: pass limit to cut extra results ?
    }
    const { meta = {} } = action;

    // validateAction(action);
    // validateOptions(meta);
    // validateParams(searchParams); // TODO: validate filter names with constants

    const [resultsType] = types;
    const accessToken = getAccessToken(getState());
    // const accessToken = 'dwad123231uhhuh13uh13';

    if (typeof accessToken !== 'string' || !accessToken.length) {
      throw new Error('No valid access token');
    }

    // TODO: not destructure postAuthorId here and pass whole searchParams obj
    // to transformResponse(transformResponse)
    const {
      baseRequestURL, query, items, target, filters, resultsLimit,
    } = searchParams;
    const {
      // TODO: retrieve next 2 from options passed to middleware factory
      requestInterval,
      maxAttempts,
    } = meta;

    // doublecheck
    clearInterval(intervalId);
    // will also clear "requestsByIds" in store
    next({ type: SEARCH_BY_ITEMS_START, limit: resultsLimit });

    // console.log('uuid.v1() ', uuid.v1());
    // console.log('uuid.v4() ', uuid.v4());

    const queryString = Object.keys(query).reduce((acc, item) => (
      `${acc === '' ? acc : `${acc}&`}` +
      `${item}=${query[item]}`
    ), '');

    console.log('QUERYSTRING: ', queryString);

    let results = [];

    const makeCallToAPI = (itemId) => {
      console.log('ITEM ID ', itemId);

      // new requestHandler = new RequestHandler({
      //   next, getState, id: itemId
      // });

      console.time('~~~ CALL API REQUEST ~~~');
      next({ type: SEARCH_BY_ITEMS_REQUEST, id: itemId });
      console.timeEnd('~~~ CALL API REQUEST ~~~');

      console.time('::: CALL API :::');

      const currentRequestURL = `${baseRequestURL}?` +
      `${queryString}` +
      `&item_id=${itemId}&access_token=${accessToken}`;
      // const currentRequestURL = `${baseRequestURL}?` +
      // `&item_id=${itemId}&user_id=${likerId}` +
      // `&owner_id=${ownerId}&type=${objectType}` +
      // `&access_token=${accessToken}&v=${apiVersion}`;

      const promise = jsonpPromise(currentRequestURL)
        .then(
          onSuccess({ next, getState, itemId }),
          onFail({ next, getState, itemId }),
        )
        // TODO: filter response first here ?
        // .then(response => transformResponse(response, target, filters))
        .then(response => response.liked > 0)
        .then(
          isLiked => isLiked && next({ type: resultsType, itemId }),
          // TODO: consider if (eror.code === AUTH_FAILED) clearInterval() with
          // replacing first makeCallToAPI() after setInterval
          err => (err.isRefuse ? console.warn(err) : console.error(err)),
        )
        .then((isLiked) => {
          if (isLiked) {
            results.push(itemId);
            console.log('SEARCH BY ITEMS resultS: ', results);
          }
        });
      console.timeEnd('::: CALL API :::');
      return promise;
    };
    // first request before timer tick
    makeCallToAPI(items[0].id);

    intervalId = setInterval(() => {
      // const tempCheckpoint = checkpoint;
      // checkpoint = performance.now();
      // console.warn(`NEW interval TICK: ${checkpoint - tempCheckpoint}`);
      const measureId = shortId.generate();

      console.time(`*** INTERVAL SELECTORS *** ${measureId}`);

      // total is equivalent of "count" field in response from vk API
      const state = getState();
      const resultsCount = getNumberOfResults(state);
      const itemIndex = getCurrentItemIndex(state);
      const reqs = getRequestsById(state);
      const failed = getSearchByItemsFailed(state);
      const pending = getSearchByItemsPending(state);
      const errorCode = getSearchByItemsErrorCode(state);

      console.timeEnd(`*** INTERVAL SELECTORS *** ${measureId}`);

      console.time(`=== INTERVAL CONDITIONS === ${measureId}`);

      if (errorCode === AUTH_FAILED) {
        clearInterval(intervalId);
        console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        return;
      }

      // NOTE: max number of parallel requests/connections ~ 6-8 / 17
      // TODO: maxPendingCount ~ 6

      // requests that reach maxAttempts limit are considered completely failed
      // next failed requests should be sent again
      // TODO: req[o] -> getRequestByOffset(o)
      const toSendAgain = failed.filter(id => reqs[id].attempt < maxAttempts);

      // repeat first of failed requests
      if (toSendAgain.length > 0) {
        const [idToRepeat] = toSendAgain;
        // const requestToRepeat = reqs[idToRepeat];
        // console.log(`Repeat FAILED with ${idToRepeat} ` +
        //   `offset and attempt ${reqs[idToRepeat].attempt + 1} `);

        makeCallToAPI(idToRepeat);
        console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        return;
      }

      const nextIndex = itemIndex + 1;

      // TODO: resolve case with count: 0

      // request next portion of items using increased offset
      if (
        (!resultsLimit || resultsCount < resultsLimit) &&
        (items.length && nextIndex < items.length)
      ) {
        makeCallToAPI(items[nextIndex].id);
        console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        console.time(`<<< SET INDEX ${measureId} >>>`);
        next({ type: SEARCH_BY_ITEMS_SET_INDEX, nextIndex });
        console.timeEnd(`<<< SET INDEX ${measureId} >>>`);
        return;
      }

      // end search
      if (pending.length === 0) {
        clearInterval(intervalId);
        next({ type: SEARCH_BY_ITEMS_END });
        console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        return;
      }
      console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
    }, requestInterval);
    // NOTE: return was added for eslint, maybe replace it with
    // next(initialAction); OR next({ type: requestType });
    return null;
  };
};

export default searchByItems;
