import {
  TERMINATE_SEARCH, SEARCH_START, SEARCH_SET_OFFSET, SEARCH_END, SEARCH_REQUEST,
} from 'constants/actionTypes';
import {
  getAccessToken, getSearchTotal, getSearchOffset,
  getRequestsByOffset, getFailedList, getPendingList,
} from 'selectors';
// import fetchJSONP from 'utils/fetchJSONP';
import jsonpPromise from 'utils/jsonpPromise';
import { onSuccess, onFail } from './requestHandlers';
import handleResponse from './handleResponse';
import { validateAction, validateOptions, validateParams } from './validation';

export const SEARCH_PARAMETERS = 'SEARCH::Parameters';

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: not repeat pending, just make them failed instead; Belated Overdue
// const checkAndRepeatFailed = () => {}

const searchProcessor = ({ dispatch, getState }) => {
  let searchIntervalId;
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
    // TODO: destructure from action callAPI and handleResponse functions with
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
      clearInterval(searchIntervalId);
      return next(action); // TODO: pass limit to cut extra results ?
    }
    validateAction(action);

    const accessToken = getAccessToken(getState());

    // TODO: consider to dispatch action with error message instead
    if (typeof accessToken !== 'string' || !accessToken.length) {
      throw new Error('Expected access token to be not empty string');
    }
    const { meta = {} } = action;

    validateOptions(meta);
    validateParams(searchParams);

    const [resultsType] = types;
    // TODO: not destructure postAuthorId here and pass whole searchParams obj
    // to handleResponse(handleResponse)
    const { baseRequestURL, mode, filters, resultsLimit } = searchParams;
    const { postAuthorId, postAuthorSex } = filters;
    const {
      // TODO: retrieve defaults of next 3 from options passed to middleware factory
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      maxAttempts,
    } = meta;

    // TODO: validate postAuthorId, baseRequestURL

    // doublecheck
    clearInterval(searchIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: SEARCH_START, limit: resultsLimit });

    // TODO: cache posts and not search if amount and last id is the same

    // let checkpoint = performance.now(); // TEMP:
    // let checkpoint2 = performance.now(); // TEMP:

    // TODO: replace to top level
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
          onFail(next, getState, offset),
        )
        .then(response => handleResponse(response, 'wall-posts', {
          authorId: postAuthorId,
          sex: postAuthorSex,
        }))
        .then(
          results => next({ type: resultsType, ...results }),
          error => console.warn(error), // TODO: try error.message and next()
        );
    };
    // first request before timer tick
    makeCallToAPI();

    searchIntervalId = setInterval(() => {
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
        clearInterval(searchIntervalId);
        next({ type: SEARCH_END });
      }
    }, requestInterval);
    // NOTE: return was added for eslint, maybe replace it with
    // next(initialAction); OR next({ type: requestType });
    return null;
  };
};

export default searchProcessor;
