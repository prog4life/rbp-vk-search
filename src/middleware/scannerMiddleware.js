const scannerMiddleware = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount; // total amount of items to search among
  let processed = 0;
  let isSearchTerminated = false;
  // TODO: add "STEP" constant that will be equal to "offset" modifier
  let STEP = 100;

  // const requests = [
  //   {
  //     offset: 400,
  //     pending: true, // failed request will get "false" value here
  //     failCount: 0   // idea
  //     timestamp: Number // idea
  //   }
  // ];

  // const onRequestStart = (currentOffset) => {
  //   dispatch({
  //     type: 'REQUEST_START',
  //     offset: currentOffset
  //   });
  // };

  // TODO: use timestamp - Date.now() === timeout to track failed requests

  // remove successful request obj from "requests"
  const onRequestSuccess = (currentOffset, actionCreator) => (response) => {
    if (!isSearchTerminated) {
      dispatch(actionCreator(currentOffset));
      return response;
    }
    throw Error('Unnecessary response, search is already terminated');
  };

  // add failed request obj with pending: false to "requests"
  const onRequestFail = (currentOffset, actionCreator) => (e) => {
    if (!isSearchTerminated) {
      dispatch(actionCreator(currentOffset));
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

  return next => (action) => {
    const { accessToken } = getState();
    const {
      callAPI,
      handleResponse,
      searchConfig,
      saveResults,
      requestStart,
      requestSuccess,
      requestFail,
      updateSearchProgress,
      completeSearch,
      type
    } = action;

    if (!searchConfig && type !== 'TERMINATE_SEARCH') {
      return next(action);
    }

    // NOTE: additional !type condition was added
    if (!type) {
      return next(action);
    }

    if (type === 'TERMINATE_SEARCH') {
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

    if (typeof saveResults !== 'function') {
      throw new Error('Expected saveResults to be function');
    }

    if (typeof updateSearchProgress !== 'function') {
      throw new Error('Expected updateSearchProgress to be function');
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

    const performSingleCall = (currentOffset) => {
      // add request obj with pending: true to in-store "requests"
      // onRequestStart(currentOffset);
      dispatch(requestStart(currentOffset));

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      callAPI(currentAPIReqUrl)
        .then(
          onRequestSuccess(currentOffset, requestSuccess),
          onRequestFail(currentOffset, requestFail)
        )
        .then(setResponseCount)
        .then(handleResponse) // with same function call in "wallPostsSearchStart"
        // .then(handleResponse(authorId)) // TODO: throw there
        // .then(collectResults)
        // TODO: replace by then(addPartOfResultsIfFound(searchResultsLimit))
        .then((chunk) => {
          // TODO: consider doublechecking with "isSearchTerminated"
          if (chunk && chunk.length > 0) {
            dispatch(saveResults(chunk, searchResultsLimit));
          }
          return chunk;
        })
        // TODO: replace by then(handleSearchProgress)
        .then(() => {
          if (responseCount && !isSearchTerminated) {
            processed = processed + 100 > responseCount
              ? responseCount
              : processed + 100;
            dispatch(updateSearchProgress(responseCount, processed));
          }
        })
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      const { requests } = getState();

      if (requests.length > 0) {
        // const overdue = requests.find(request => (
        //   request.pending && Date.now() - request.timestamp > waitTimeout
        // ));
        const overdue = requests.find((request) => {
          const difference = Date.now() - request.timestamp;
          console.log('PENDING REQ DIFFERENCE: ', difference);

          return request.pending && difference > waitTimeout;
        });
        console.log('OVERDUE: ', JSON.stringify(overdue, null, 2));
        // TODO: add overdue.repeats < 3 condition
        if (overdue) {
          // cancel and repeat
          console.log('NEED CANCEL AND REPEAT');
          performSingleCall(overdue.offset);
          return;
        }

        const pendingReq = requests.find(request => request.pending);

        console.log('REQUESTS 4: ', JSON.stringify(requests, null, 2));

        if (pendingReq && waitPending) {
          return;
        }

        const failedReq = requests.find(request => !request.pending);

        // no pending requests, only failed requests present OR:
        // "waitPending" is false and failed requests present -
        // in both cases repeat first failed request
        if (!pendingReq || failedReq) {
          console.log('Not waiting for pending and call: ', failedReq.offset);

          performSingleCall(failedReq.offset);
          return;
        }

        offset += 100;
        // no failed requests, "waitPending" is false,
        // all items requested but some pending requests still present
        if (offset > responseCount) { // TODO: add !responseCount ?
          offset -= 100;
          return;
        }
      } else {
        // no pending or failed requests - increase offset to request next
        // portion of items
        offset += 100;
      }

      if (getState().results.length < searchResultsLimit) { // was results.length
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
