import {
  TERMINATE_SEARCH, SEARCH_START, SEARCH_SET_OFFSET, SEARCH_END, SEARCH_REQUEST,
} from 'constants/actionTypes';
import { AUTH_FAILED } from 'constants/api'; // TODO: pass with options ?
import {
  getAccessToken, getSearchTotal, getSearchOffset, getSearchErrorCode,
  getRequestsByOffset, getFailedList, getPendingList,
} from 'selectors';
// import fetchJSONP from 'utils/fetchJSONP';
import jsonpPromise from 'utils/jsonpPromise';
import { onSuccess, onFail } from './requestHandlers';
import transformResponse from './transformResponse';
import {
  validateAction, validateOffsetModifier, validateOptions, validateParams
} from './validation';

export const SEARCH_PARAMETERS = 'SEARCH::Parameters';

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: not repeat pending, just make them failed instead; Belated Overdue
// const checkAndRepeatFailed = () => {}

// TODO: middleware factory
// export default function createSearchProcessorMiddleware(apiClient, options) {
//   const { offsetModifier, requestInterval = 350, maxAttempts = 5 } = options;
//
//   validateOffsetModifier(offsetModifier);
//
//   return searchProcessor;
// }

const searchProcessor = ({ dispatch, getState }) => {
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
  //     startTime: integer // Date.now() value
  //     isPending: true, // failed request will get "false" value here
  //   }
  // };

  return next => (action) => {
    // TODO: destructure from action callAPI and transformResponse functions with
    // imported defaults
    const { type, types, getNumberOfResults } = action;
    const searchParams = action[SEARCH_PARAMETERS];

    if (typeof searchParams === 'undefined' && type !== TERMINATE_SEARCH) {
      return next(action);
    }
    if (!types && type !== TERMINATE_SEARCH) {
      return next(action);
    }
    if (type === TERMINATE_SEARCH) {
      clearInterval(intervalId);
      return next(action); // TODO: pass limit to cut extra results ?
    }
    const { meta = {} } = action;

    validateAction(action);
    validateOptions(meta);
    validateParams(searchParams);

    const [resultsType] = types;
    const accessToken = getAccessToken(getState());
    // const accessToken = 'dwad123231uhhuh13uh13';

    if (typeof accessToken !== 'string' || !accessToken.length) {
      throw new Error('No valid access token');
    }

    // TODO: not destructure postAuthorId here and pass whole searchParams obj
    // to transformResponse(transformResponse)
    const { baseRequestURL, mode, filters, resultsLimit } = searchParams;
    const { postAuthorId, postAuthorSex } = filters; // TEMP: pass entire obj further
    const {
      // TODO: retrieve next 3 from options passed to middleware factory
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      maxAttempts,
    } = meta;

    // doublecheck
    clearInterval(intervalId);
    // will also clear "requests" in store
    next({ type: SEARCH_START, limit: resultsLimit });

    // TODO: cache posts and not search in cache first if amount and last id
    // is the same

    // let checkpoint = performance.now(); // TEMP:
    // let checkpoint2 = performance.now(); // TEMP:

    // TODO: replace to top level ?
    const makeCallToAPI = (offset = 0) => {
      // const tempCheckpoint2 = checkpoint2;
      // checkpoint2 = performance.now();
      // console.warn(`NEW REQUEST with ${offset} offset, ` +
      //   `interval: ${checkpoint2 - tempCheckpoint2} and
      //    shift: ${performance.now() - checkpoint}`);
      // add request obj with isPending: true to "requests"
      next({ type: SEARCH_REQUEST, offset, startTime: Date.now() });

      const currentRequestURL = `${baseRequestURL}&offset=${offset}` +
        `&access_token=${accessToken}`;

      return jsonpPromise(currentRequestURL)
        .then(
          onSuccess({ next, getState, offset }),
          onFail({ next, getState, offset }),
        )
        .then(response => transformResponse(response, 'wall-posts', {
          authorId: postAuthorId,
          sex: postAuthorSex,
        }))
        .then(
          results => next({ type: resultsType, ...results }),
          // TODO: consider if (eror.code === AUTH_FAILED) clearInterval() with
          // replacing first makeCallToAPI() after setInterval
          err => (err.isRefuse ? console.warn(err) : console.error(err)),
        );
    };
    // first request before timer tick
    makeCallToAPI();

    intervalId = setInterval(() => {
      // const tempCheckpoint = checkpoint;
      // checkpoint = performance.now();
      // console.warn(`NEW interval TICK: ${checkpoint - tempCheckpoint}`);

      // total is equivalent of "count" field in response from vk API
      const state = getState();
      const resultsCount = getNumberOfResults(state);
      const offset = getSearchOffset(state);
      const total = getSearchTotal(state);
      const reqs = getRequestsByOffset(state);
      const failed = getFailedList(state);
      const pending = getPendingList(state);
      const errorCode = getSearchErrorCode(state);

      if (errorCode === AUTH_FAILED) {
        clearInterval(intervalId);
        return;
      }

      // NOTE: max number of parallel requests/connections ~ 6-8 / 17
      // TODO: maxPendingCount ~ 6

      // requests that reach maxAttempts limit are considered completely failed
      // next failed requests should be sent again
      const toSendAgain = failed.filter(o => reqs[o].attempt < maxAttempts);

      // repeat first of failed requests
      if (toSendAgain.length > 0) {
        const [offsetToRepeat] = toSendAgain;
        // const requestToRepeat = reqs[offsetToRepeat];
        console.log(`Repeat FAILED with ${offsetToRepeat} ` +
          `offset and attempt ${reqs[offsetToRepeat].attempt + 1} `);

        makeCallToAPI(offsetToRepeat);
        return;
      }

      const nextOffset = offset + offsetModifier;

      // TODO: resolve case with count: 0

      // request next portion of items using increased offset
      if (
        (!resultsLimit || resultsCount < resultsLimit) &&
        (!total || nextOffset <= total)
      ) {
        next({ type: SEARCH_SET_OFFSET, offset: nextOffset });
        makeCallToAPI(nextOffset);
        return;
      }

      // end search
      if (pending.length === 0) {
        clearInterval(intervalId);
        next({ type: SEARCH_END });
      }
    }, requestInterval);
    // NOTE: return was added for eslint, maybe replace it with
    // next(initialAction); OR next({ type: requestType });
    return null;
  };
};

export default searchProcessor;
