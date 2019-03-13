import {
  TERMINATE_SEARCH, SEARCH_START, SEARCH_SET_OFFSET, SEARCH_END, SEARCH_REQUEST,
} from 'constants/actionTypes';
import { AUTH_FAILED } from 'constants/api'; // TODO: pass with options ?
import {
  getSearchTotal, getSearchOffset, getSearchErrorCode,
  getRequestsByOffset, getFailedList, getPendingList,
} from 'selectors';
// import fetchJSONP from 'utils/fetchJSONP';
import openAPI from 'utils/openAPI';
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

    // validateAction(action, SEARCH_PARAMETERS);
    validateOptions(meta);
    // validateParams(searchParams); // TODO: validate filter names with constants

    const [resultsType] = types;

    // TODO: not destructure postAuthorId here and pass whole searchParams obj
    // to transformResponse(transformResponse)
    const {
      requestParams, method, target, filters, resultsLimit,
    } = searchParams;
    const { owner_id: ownerId } = requestParams;
    const {
      // TODO: retrieve next 3 from options passed to middleware factory
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      maxAttempts,
    } = meta;

    if (!ownerId) {
      delete requestParams.owner_id;
    }

    // doublecheck
    clearInterval(intervalId);
    // will also clear "requests" in store
    next({ type: SEARCH_START, limit: resultsLimit });

    // TODO: cache posts and search in cache first if amount and last id
    // is the same

    // TODO: replace to top level ?
    const makeCallToAPI = (offset = 0) => {
      // const measureId = shortId.generate();
      // add request obj with isPending: true to "requests"
      // console.time('~~~ CALL API REQUEST ~~~');
      next({ type: SEARCH_REQUEST, offset });
      // console.timeEnd('~~~ CALL API REQUEST ~~~');

      // console.time('::: CALL API :::');

      // TODO: Promise.prototype.finally(onFinally), onFulfilled, onRejected

      const promise = openAPI.call(method, { ...requestParams, offset })
        .then(
          onSuccess({ next, getState, offset }),
          onFail({ next, getState, offset }),
        )
        // TODO: filter response first here ?
        .then((response) => {
          // console.time('--- TRANSFORM RESPONSE ---');
          const transformed = transformResponse(response, target, filters);
          // console.timeEnd('--- TRANSFORM RESPONSE ---');
          return transformed;
        })
        .then(
          results => next({ type: resultsType, ...results }),
          // results => results,
          // TODO: consider if (eror.code === AUTH_FAILED) clearInterval() with
          // replacing first makeCallToAPI() after setInterval
          err => (err.isRefuse ? console.warn(err) : console.error(err)),
        );
      // console.timeEnd('::: CALL API :::');
      return promise;
    };
    // first request before timer tick
    makeCallToAPI();

    intervalId = setInterval(() => {
      // const measureId = shortId.generate();
      // console.time(`*** INTERVAL SELECTORS *** ${measureId}`);

      // total is equivalent of "count" field in response from vk API
      const state = getState();
      const resultsCount = getNumberOfResults(state);
      const offset = getSearchOffset(state);
      const total = getSearchTotal(state);
      const reqs = getRequestsByOffset(state);
      const failed = getFailedList(state);
      const pending = getPendingList(state);
      const errorCode = getSearchErrorCode(state);

      // console.timeEnd(`*** INTERVAL SELECTORS *** ${measureId}`);

      // console.time(`=== INTERVAL CONDITIONS === ${measureId}`);

      if (errorCode === AUTH_FAILED) {
        clearInterval(intervalId);
        // console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        return;
      }

      // NOTE: max number of parallel requests/connections ~ 6-8 / 17
      // TODO: maxPendingCount ~ 6

      // requests that reach maxAttempts limit are considered completely failed
      // next failed requests should be sent again
      // TODO: req[o] -> getRequestByOffset(o)
      const toSendAgain = failed.filter(o => reqs[o].attempt < maxAttempts);

      // repeat first of failed requests
      if (toSendAgain.length > 0) {
        const [offsetToRepeat] = toSendAgain;
        // const requestToRepeat = reqs[offsetToRepeat];
        // console.log(`Repeat FAILED with ${offsetToRepeat} ` +
        //   `offset and attempt ${reqs[offsetToRepeat].attempt + 1} `);

        makeCallToAPI(offsetToRepeat);
        // console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        return;
      }

      const nextOffset = offset + offsetModifier;

      // TODO: resolve case with count: 0

      // request next portion of items using increased offset
      if (
        (!resultsLimit || resultsCount < resultsLimit)
        && (!total || nextOffset <= total)
      ) {
        makeCallToAPI(nextOffset);
        // console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        // console.time(`<<< SET OFFSET ${measureId} >>>`);
        next({ type: SEARCH_SET_OFFSET, offset: nextOffset });
        // console.timeEnd(`<<< SET OFFSET ${measureId} >>>`);
        return;
      }

      // end search
      if (pending.length === 0) {
        clearInterval(intervalId);
        next({ type: SEARCH_END });
        // console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
        // return;
      }
      // console.timeEnd(`=== INTERVAL CONDITIONS === ${measureId}`);
    }, requestInterval);
    // NOTE: return was added for eslint, maybe replace it with
    // next(initialAction); OR next({ type: requestType });
    return null;
  };
};

export default searchProcessor;
