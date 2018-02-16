// TODO: rename to searchProcessor, extractor, e.t.c
const scannerMiddleware = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount; // total amount of items to search among
  let processed = 0;
  let isSearchTerminated = false;
  const processedOffsets = [];

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
  const onRequestSuccess = (currentOffset, actionCreator) => (response) => {
    if (!isSearchTerminated) {
      dispatch(actionCreator(currentOffset));
      return response;
    }
    throw Error('Unnecessary response, search is already terminated');
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (currentOffset, actionCreator, attempt) => (e) => {
    if (!isSearchTerminated) {
      dispatch(actionCreator(currentOffset, attempt));
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

  const savePartOfResults = limit => (chunk) => {
    // TODO: consider doublechecking with "isSearchTerminated"
    if (chunk && chunk.length > 0) {
      dispatch(addResults(chunk, limit));
    }
    return chunk;
  };

  const handleSearchProgress = (currentOffset, offsetModifier, actionCreator) => () => {
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
      dispatch(actionCreator(responseCount, processed));
    }
  };

  return next => (action) => {
    const { accessToken } = getState();
    const {
      callAPI,
      handleResponse,
      searchConfig,
      addResults,
      requestStart,
      requestSuccess,
      requestFail,
      updateSearch,
      completeSearch,
      type
    } = action;

    if (!searchConfig && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    // NOTE: additional !type condition was added
    if (!type) {
      return next(action);
    }

    if (type === 'SEARCH_TERMINATE') {
      isSearchTerminated = true;
      clearInterval(scannerIntervalId);
      // TODO: clear failedReuests in store
      return next(action);
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function');
    }

    if (typeof handleResponse !== 'function') {
      throw new Error('Expected handleResponse to be a function');
    }

    if (typeof addResults !== 'function') {
      throw new Error('Expected addResults to be function');
    }

    if (typeof updateSearch !== 'function') {
      throw new Error('Expected updateSearch to be function');
    }

    if (typeof completeSearch !== 'function') {
      throw new Error('Expected completeSearch to be function');
    }

    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object of search config params');
    }

    const {
      // authorId,
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
    next(action);
    offset = 0;
    processed = 0;
    isSearchTerminated = false;
    // results.length = 0;

    const performSingleCall = (currentOffset, attempt) => {
      // add request obj with isPending: true to in-store "requests"
      // onRequestStart(currentOffset);
      dispatch(requestStart(currentOffset, attempt));

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      callAPI(currentAPIReqUrl)
        .then(
          onRequestSuccess(currentOffset, requestSuccess),
          onRequestFail(currentOffset, requestFail, attempt)
        )
        .then(setResponseCount)
        .then(handleResponse)
        // .then(collectResults)
        // TODO: replace by then(savePartOfResults(searchResultsLimit))
        .then()
        // TODO: replace by then(handleSearchProgress)
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
          performSingleCall(expired.offset, expired.attempt + 1);
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

          performSingleCall(failedReq.offset, failedReq.attempt + 1);
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
          performSingleCall(offset);
          return;
        }
      }

      if (requests.length === 0) {
        clearInterval(scannerIntervalId);
        dispatch(completeSearch());
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return performSingleCall(offset);
  };
};

export default scannerMiddleware;
