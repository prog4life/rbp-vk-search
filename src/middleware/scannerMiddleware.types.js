import axiosJSONP from 'utils/axios-jsonp';
import prepareWallPosts from 'utils/response-handling';

export const SEARCH_CONFIG = 'Search Config';

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: rename to searchProcessor, extractor, e.t.c
const searchProcessor = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount; // total amount of items to search among
  let processed = 0;
  let isSearchTerminated = false;
  const processedOffsets = []; // offsets that were used for successful requests

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

  // TODO: use startTime - Date.now() === timeout to track failed requests

  // remove successful request obj from "requests"
  const onRequestSuccess = (currentOffset, type) => (response) => {
    if (!isSearchTerminated) {
      dispatch({
        type,
        offset: currentOffset
      });
      return response;
    }
    throw Error('Unnecessary response, search is already terminated');
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (currentOffset, type, attempt) => (e) => {
    if (!isSearchTerminated) {
      dispatch({
        type,
        offset: currentOffset,
        attempt
      });
      throw Error(`Request with ${currentOffset} offset FAILED, ${e.message}`);
    }
    throw Error('Unnecessary response, search is already terminated');
  };

  const setResponseCount = (response) => {
    responseCount = response && response.count
      ? response.count
      : responseCount;
    return response;
  };

  const savePartOfResults = (limit, addResultsType) => (chunk) => {
    // TODO: consider doublechecking with "isSearchTerminated"
    if (chunk && chunk.length > 0) {
      // NOTE: but need to use "next" instead of dispatch
      dispatch({
        type: addResultsType,
        results: chunk,
        limit
      });
    }
    return chunk;
  };

  const handleSearchProgress = (currentOffset, offsetModifier, type) => () => {
    if (responseCount && !isSearchTerminated) {
      const currIndex = processedOffsets.indexOf(currentOffset);

      if (currIndex >= 0) {
        throw Error(`Request with ${currentOffset} is counted already
          under index of ${currIndex}`);
      }
      processedOffsets.push(currentOffset);
      // to get correct value of processed items (not bigger than total)
      // at the end of search
      processed = processed + offsetModifier > responseCount
        ? responseCount
        : processed + offsetModifier;

      dispatch({
        type,
        total: responseCount,
        processed
      });
    }
  };

  return next => (action) => {
    const { accessToken } = getState();
    const { type, types } = action;
    const searchConfig = action[SEARCH_CONFIG];

    if (typeof searchConfig === 'undefined' && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    // if (!types && type !== 'SEARCH_TERMINATE') { // + !searchConfig
    //   return next(action);
    // }

    if (type === 'SEARCH_TERMINATE') {
      isSearchTerminated = true;
      clearInterval(scannerIntervalId);
      // TODO: clear failedReuests in store
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

    const {
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      waitPending,
      waitTimeout
    } = searchConfig;

    // doublecheck
    clearInterval(scannerIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });
    offset = 0;
    processed = 0;
    isSearchTerminated = false;
    processedOffsets.length = 0;
    // results.length = 0;

    const makeCallToAPI = (currentOffset, attempt) => {
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
        .then(
          onRequestSuccess(currentOffset, requestSuccessType),
          onRequestFail(currentOffset, requestFailType, attempt)
        )
        .then(setResponseCount)
        .then(prepareWallPosts(authorId))
        // .then(collectResults)
        .then(savePartOfResults(searchResultsLimit, addResultsType))
        .then(handleSearchProgress(
          currentOffset,
          offsetModifier,
          updateSearchType
        ))
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      const { requests } = getState();

      if (requests.length > 0) {
        console.log('REQUESTS 4: ', JSON.stringify(requests, null, 2));

        // const expired = requests.find(request => (
        //   request.isPending && Date.now() - request.startTime > waitTimeout
        // ));
        const expired = requests.find((request) => {
          const difference = Date.now() - request.startTime;

          if (request.isPending && difference > waitTimeout) {
            console.log(`PENDING ${request.offset} REQ DIFFERENCE: ${difference}`);
            return true;
          }
          return false;
        });
        console.log('EXPIRED: ', JSON.stringify(expired, null, 2));
        // TODO: add expired.attempt < maxAttemptsPending condition
        if (expired) {
          // cancel and repeat
          console.log('WILL REPEAT with attempt COUNT: ', expired.attempt + 1);
          makeCallToAPI(expired.offset, expired.attempt + 1);
          return;
        }

        const pendingReq = requests.find(request => request.isPending);

        if (pendingReq && waitPending) {
          return;
        }

        const failedReq = requests.find(request => !request.isPending);

        // no pending requests, only failed requests present OR:
        // "waitPending" is false and failed requests present -
        // in both cases repeat first failed request
        if (!pendingReq || failedReq) {
          console.log('Not waiting for pending and call: ', failedReq.offset);

          makeCallToAPI(failedReq.offset, failedReq.attempt + 1);
          return;
        }

        offset += offsetModifier;
        // no failed requests, "waitPending" is false,
        // all items requested but some pending requests still present
        if (offset > responseCount) { // TODO: add !responseCount ?
          offset -= offsetModifier;
          return;
        }
      } else {
        // no pending or failed requests - increase offset to request next
        // portion of items
        offset += offsetModifier;
      }

      const { results } = getState();
      // was results.length
      if (!searchResultsLimit || results.length < searchResultsLimit) {
        if (!responseCount || offset <= responseCount) {
          makeCallToAPI(offset);
          return;
        }
      }

      if (requests.length === 0) {
        clearInterval(scannerIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return makeCallToAPI(offset);
  };
};

export default searchProcessor;
