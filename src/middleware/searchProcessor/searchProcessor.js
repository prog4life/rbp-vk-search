// TODO: replace next dependency to configureStore
import { maxAttempts as maxAttemptsDefault } from 'config/common';
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
import transformResponse from './transformResponse';
// TODO: pass with action
// import { API_CALL_PARAMS } from 'middleware/callAPI';

export const SEARCH_CONFIG = 'SEARCH::Config'; // TODO: rename to search parameters

// IDEA
export const kindsOfData = {
  wallPosts: 'WALL_POSTS',
  // wallComments: 'WALL_COMMENTS'
};

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
    const searchConfig = action[SEARCH_CONFIG];

    if (typeof searchConfig === 'undefined' && type !== TERMINATE_SEARCH) {
      return next(action);
    }
    if (!types && type !== TERMINATE_SEARCH) {
      return next(action);
    }
    if (type === TERMINATE_SEARCH) {
      clearInterval(searchIntervalId);
      return next(action); // TODO: pass limit to cut extra results ?
    }

    if (!Array.isArray(types) || types.length !== 1) {
      throw new Error('Expected an array of 1 action types.');
    }
    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object with search config params');
    }
    if (typeof getNumberOfResults !== 'function') {
      throw new Error('Expected "getNumberOfResults" to be function');
    }
    if (!types.every(t => typeof t === 'string')) {
      throw new Error('Expected action types to be strings');
    }
    const accessToken = getAccessToken(getState());

    // TODO: consider to dispatch action with error message instead
    if (typeof accessToken !== 'string' || !accessToken.length) {
      throw new Error('Expected access token to be not empty string');
    }

    const [
      // requestType,
      // successType,
      // failType, // TODO: make it interval const
      resultsType,
    ] = types;

    // TODO: import offsetModifier, requestInterval
    // from common config and set as defaults here
    const {
      // TODO: not destructure authorId here and pass whole searchConfig obj to
      // handleResponse(transformResponse)
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      // TODO: retrieve defaults of next 3 from options passed to middleware factory
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      maxAttempts = maxAttemptsDefault,
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(searchIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: SEARCH_START, limit: searchResultsLimit });

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

      const currentAPICallUrl = `${baseAPIReqUrl}&offset=${offset}` +
        `&access_token=${accessToken}`;

      return jsonpPromise(currentAPICallUrl)
        .then(
          onSuccess(next, getState, offset),
          onFail(next, getState, offset),
        )
        .then(response => transformResponse(response, 'wall-posts', authorId))
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
        (!searchResultsLimit || resultsCount < searchResultsLimit) &&
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
