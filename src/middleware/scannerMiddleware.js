import axiosJSONP from 'utils/axios-jsonp';
import prepareWallPosts from 'utils/response-handling';
import {
  maxAttemptsPending as maxAttemptsPendingDefault,
  maxAttemptsFailed as maxAttemptsFailedDefault
} from 'config/common';

export const SEARCH_CONFIG = 'Search Config';

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: rename to searchProcessor, extractor, e.t.c
const scannerMiddleware = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  // let scannerIntervalId;
  // let offset = 0;
  // let responseCount; // total amount of items to search among
  // let processed = 0;
  // let isSearchTerminated = false;
  const search = {
    scannerIntervalId: undefined,
    isActive: false,
    offset: 0,
    total: undefined,
    processed: 0,
    processedOffsets: [] // offsets of successful requests
  };
  let requests = {};

  // const requests = {
  //   'offset_400': {
  //     id: 'offset_400'
  //     offset: 400,
  //     isPending: true, // failed request will get "false" value here
  //     // how many times unresponded pending or failed request was sent again
  //     attempt: 0
  //     startTime: Number // Date.now() value
  //   }
  // };

  const onRequestStart = (offset, attempt) => {
    const key = `offset_${offset}`;

    requests[key] = {
      id: key,
      offset,
      startTime: Date.now(),
      attempt,
      isPending: true,
      isDone: false
    };
  };

  // remove successful request obj from "requests"
  const onRequestSuccess = (searchState, offset) => (response) => {
    const { isActive } = searchState;

    if (isActive) {
      const key = `offset_${offset}`;

      delete requests[key];
      return response;
    }
    throw Error(`Unnecessary response ${offset}, search is already terminated`);
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (searchState, offset, attempt) => (e) => {
    const { isActive } = searchState;

    if (isActive) {
      const key = `offset_${offset}`;
      const { startTime } = requests[key]; // TODO: replace with object spread

      requests[key] = {
        id: key,
        offset,
        startTime,
        attempt,
        isPending: false,
        isDone: false
      };

      throw Error(`Request with ${offset} offset FAILED, ${e.message}`);
    }
    throw Error(`Unnecessary response ${offset}, search is already terminated`);
  };

  // const setTotal = next => (response) => {
  //   if (response && response.count) {
  //     next({
  //       type: 'SEARCH_SET_TOTAL', // TODO: check if it will be logged
  //       total: response.count
  //     });
  //   }
  //   return response;
  // };

  const updateResponseCount = searchState => (response) => {
    searchState.total = response && response.count
      ? response.count
      : searchState.total;
    return response;
  };

  const onSearchProgress = (searchState, next, offset, offsetModifier, type) => (
    (response) => {
      const {
        isActive, total, processed, processedOffsets
      } = searchState;

      if (isActive) {
        let updated = processedOffsets.some(o => o === offset)
          ? processed
          : processedOffsets.push(offset) * offsetModifier;

        // to get correct value of processed items (not bigger than total)
        // at the end of search
        updated = updated > total
          ? total
          : updated;

        // if (responseCount !== total || updated !== processed) {
        if (updated !== processed) {
          next({
            type,
            total,
            processed: updated
          });
        }
      }
      return response;
    }
  );

  const savePartOfResults = (next, limit, addResultsType) => (chunk) => {
    if (chunk && chunk.length > 0) {
      // NOTE: more suitable to use "next" instead of dispatch
      next({
        type: addResultsType,
        results: chunk,
        limit
      });
    }
    return chunk;
  };

  return next => (action) => {
    const { accessToken } = getState();
    // TODO: destructure from action callAPI and handleResponse functions with
    // importd default handlers
    const { type, types } = action;
    const searchConfig = action[SEARCH_CONFIG];

    if (typeof searchConfig === 'undefined' && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    if (!types && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    if (type === 'SEARCH_TERMINATE') {
      search.isActive = false;
      clearInterval(search.scannerIntervalId);
      return next(action);
    }

    if (!Array.isArray(types) || types.length !== 4) {
      throw new Error('Expected an array of seven action types.');
    }
    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object of search config params');
    }
    if (!types.every(t => typeof t === 'string')) {
      throw new Error('Expected action types to be strings.');
    }

    const [
      searchStartType,
      addResultsType,
      updateSearchType,
      searchEndType
    ] = types;

    // TODO: import offsetModifier, requestInterval, waitPending and waitTimeout
    // from common config and set as defaults here
    const {
      // TODO: not destructure authorId here and pass whole searchConfig obj to
      // handleResponse (prepareWallPosts)
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      waitPending,
      waitTimeout,
      maxAttemptsPending = maxAttemptsPendingDefault,
      maxAttemptsFailed = maxAttemptsFailedDefault
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(search.scannerIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });
    requests = {};
    search.offset = 0;
    search.processed = 0;
    search.isActive = true;
    search.processedOffsets.length = 0;
    // results.length = 0;

    const performSingleCall = (offset = 0, attempt = 1) => {
      // const { accessToken } = getState();
      // add request obj with isPending: true to "requests"
      onRequestStart(offset, attempt);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${offset}`;

      // NOTE: in all next chain must be used offset value that was actual
      // at interval tick, i.e. passed to "performSingleCall"
      axiosJSONP(currentAPIReqUrl)
        .then(
          // TODO: maybe it will be expedient to get attempt value from
          //  existing request with same key
          onRequestSuccess(search, offset),
          onRequestFail(search, offset, attempt)
        )
        // .then(setTotal(next))
        .then(updateResponseCount(search))
        .then(onSearchProgress(
          search,
          next,
          offset,
          offsetModifier,
          updateSearchType
        ))
        // TODO: change to more generic then(handleResponse(searchConfig))
        .then(prepareWallPosts(authorId))
        // .then(collectResults)
        .then(savePartOfResults(next, searchResultsLimit, addResultsType))
        .catch(e => console.error(e));
    };

    search.scannerIntervalId = setInterval(() => {
      const { offset, total } = search;
      let nextOffset;

      // TODO: think over search.isActive check

      const reqs = Object.values(requests);

      if (reqs.length > 0) {
        console.log('REQUESTS 4: ', JSON.stringify(reqs, null, 2));

        // const expired = reqs.find(request => (
        //   request.isPending && Date.now() - request.startTime > waitTimeout
        //   && expired.attempt < maxAttemptsPending
        // ));
        const expired = reqs.find((req) => {
          const difference = Date.now() - req.startTime;

          if (req.isPending
            && difference > waitTimeout
            && req.attempt < maxAttemptsPending) {
            console.warn(`PENDING attempt ${req.attempt} REQ DIFFERENCE: ${difference}`);
            return true;
          }
          return false;
        });
        console.warn('EXPIRED: ', JSON.stringify(expired, null, 2));

        if (expired) {
          // cancel and repeat
          console.log('WILL REPEAT with attempt: ', expired.attempt + 1);
          performSingleCall(expired.offset, expired.attempt + 1);
          return;
        }

        const pendingReq = reqs.some(request => request.isPending);

        if (pendingReq && waitPending) {
          return;
        }

        const failedReq = reqs.find(req => (
          !req.isPending && !req.isDone && req.attempt < maxAttemptsFailed
        ));

        // no pending requests OR "waitPending" is false and failed requests
        // present - in both cases repeat first failed request
        if ((!pendingReq || !waitPending) && failedReq) {
          console.log('Not waiting for pending and call: ', failedReq.offset);

          performSingleCall(failedReq.offset, failedReq.attempt + 1);
          return;
        }

        nextOffset = offset + offsetModifier;
        // no failed requests, "waitPending" is false,
        // all items requested but some pending requests that have not exceeded
        // waitTimeout are still present
        if (nextOffset > total) { // TODO: add !total ?
          nextOffset -= offsetModifier;
          return;
        }
      } else {
        nextOffset = offset + offsetModifier;
      }
      search.offset = nextOffset;

      const { results } = getState();
      // was results.length
      if (!searchResultsLimit || results.length < searchResultsLimit) {
        // request next portion of items using increased offset OR end search
        if (!total || nextOffset <= total) {
          performSingleCall(nextOffset);
          return;
        }
      }

      if (reqs.length === 0) {
        search.isActive = false;
        clearInterval(search.scannerIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return performSingleCall(search.offset);
  };
};

export default scannerMiddleware;
