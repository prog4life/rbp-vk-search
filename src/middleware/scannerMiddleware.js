import axiosJSONP from 'utils/axios-jsonp';
import prepareWallPosts from 'utils/response-handling';

export const SEARCH_CONFIG = 'Search Config';

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: rename to searchProcessor, extractor, e.t.c
const scannerMiddleware = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  // let responseCount; // total amount of items to search among
  // let processed = 0;
  // let isSearchTerminated = false;
  const processedOffsets = []; // offsets of successful requests

  // IDEA
  // const search = {
  //   isActive: true,
  //   processed: 0,
  //   total: 0,
  //   currentOffset: 100,
  //   requests: []
  // };

  // const requests = [
  //   {
  //     offset: 400,
  //     isPending: true, // failed request will get "false" value here
  //     // how many times unresponded pending or failed request was sent again
  //     attempt: 0
  //     startTime: Number // Date.now() value
  //   }
  // ];

  // const onRequestStart = (currentOffset) => {
  //   dispatch({
  //     type: 'REQUEST_START',
  //     offset: currentOffset
  //   });
  // };

  // remove successful request obj from "requests"
  const onRequestSuccess = (next, offset, type, attempt) => (response) => {
    const { isActive } = getState().search;

    if (isActive) {
      // NOTE: more suitable to use "next" instead of dispatch
      next({
        type,
        offset,
        attempt
      });
      return response;
    }
    throw Error('Unnecessary response, search is already terminated');
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (next, offset, type, attempt) => (e) => {
    const { isActive } = getState().search;

    if (isActive) {
      // NOTE: more suitable to use "next" instead of dispatch
      next({
        type,
        offset,
        attempt
      });
      throw Error(`Request with ${offset} offset FAILED, ${e.message}`);
    }
    throw Error('Unnecessary response, search is already terminated');
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

  const onSearchProgress = (next, offset, offsetModifier, type) => (response) => {
    const { isActive, total, processed } = getState().search;

    if (isActive) {
      // to get updated "total"
      const responseCount = response && response.count ? response.count : total;

      let updated = processedOffsets.some(o => o === offset)
        ? processed
        : processedOffsets.push(offset) * offsetModifier;

      // to get correct value of processed items (not bigger than total)
      // at the end of search
      updated = updated > responseCount
        ? responseCount
        : updated;

      if (responseCount !== total || updated !== processed) {
        next({
          type,
          total: responseCount,
          processed: updated
        });
      }
    }
    return response;
  };

  return next => (action) => {
    // const { accessToken } = getState();
    const { type, types } = action;
    const searchConfig = action[SEARCH_CONFIG];

    if (typeof searchConfig === 'undefined' && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    if (!types && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    if (type === 'SEARCH_TERMINATE') {
      // isSearchTerminated = true;
      clearInterval(scannerIntervalId);
      return next(action);
    }

    if (!Array.isArray(types) || types.length !== 7) {
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
      requestStartType,
      requestSuccessType,
      requestFailType,
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
      waitTimeout
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(scannerIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });
    offset = 0;
    // processed = 0;
    // isSearchTerminated = false;
    // processedOffsets.length = 0;
    // results.length = 0;

    const performSingleCall = (currentOffset = 0, attempt = 1) => {
      const { accessToken } = getState();
      // add request obj with isPending: true to in-store "requests"
      // onRequestStart(currentOffset);
      next({
        type: requestStartType,
        offset: currentOffset,
        startTime: Date.now(),
        attempt
      });

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      axiosJSONP(currentAPIReqUrl)
        // NOTE: must use offset value that was actual at request start
        // i.e. at "performSingleCall" call moment
        .then(
          onRequestSuccess(next, currentOffset, requestSuccessType, attempt),
          onRequestFail(next, currentOffset, requestFailType, attempt)
        )
        // .then(setTotal(next))
        .then(onSearchProgress(
          next,
          currentOffset,
          offsetModifier,
          updateSearchType
        ))
        // TODO: change to more generic then(handleResponse(searchConfig))
        .then(prepareWallPosts(authorId))
        // .then(collectResults)
        .then(savePartOfResults(next, searchResultsLimit, addResultsType))
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      const { requests, search: { total } } = getState();

      if (requests.length > 0) {
        console.log('REQUESTS 4: ', JSON.stringify(requests, null, 2));

        // const expired = requests.find(request => (
        //   request.isPending && Date.now() - request.startTime > waitTimeout
        // ));
        const expired = requests.find((req) => {
          const difference = Date.now() - req.startTime;

          if (req.isPending && difference > waitTimeout) {
            console.log(`PENDING ${req.offset} REQ DIFFERENCE: ${difference}`);
            return true;
          }
          return false;
        });
        console.log('EXPIRED: ', JSON.stringify(expired, null, 2));
        // TODO: add expired.attempt < maxAttemptsPending condition
        if (expired) {
          // cancel and repeat
          console.log('WILL REPEAT with attempt COUNT: ', expired.attempt + 1);
          performSingleCall(expired.offset, expired.attempt + 1);
          return;
        }

        const pendingReq = requests.find(request => request.isPending);

        if (pendingReq && waitPending) {
          return;
        }

        const failedReq = requests.find(req => !req.isPending && !req.isDone);

        // no pending requests OR "waitPending" is false and failed requests
        // present - in both cases repeat first failed request
        if ((!pendingReq || !waitPending) && failedReq) {
          console.log('Not waiting for pending and call: ', failedReq.offset);

          performSingleCall(failedReq.offset, failedReq.attempt + 1);
          return;
        }

        offset += offsetModifier;
        // no failed requests, "waitPending" is false,
        // all items requested but some pending requests that have not exceeded
        // waitTimeout are still present
        if (offset > total) { // TODO: add !total ?
          offset -= offsetModifier;
          return;
        }
      }

      const { results } = getState();
      // was results.length
      if (!searchResultsLimit || results.length < searchResultsLimit) {
        offset += offsetModifier;
        // request next portion of items using increased offset OR end search
        if (!total || offset <= total) {
          performSingleCall(offset);
          return;
        }
      }

      if (requests.length === 0) {
        clearInterval(scannerIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return performSingleCall(offset);
  };
};

export default scannerMiddleware;
