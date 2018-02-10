const scannerMiddleware = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount;
  let isSearchTerminated = false;

  // const requests = [
  //   {
  //     offset: 400,
  //     pending: true, // failed request will get "false" value here
  //     failCount: 0   // idea
  //   }
  // ];

  // const onRequestStart = (currentOffset) => {
  //   dispatch({
  //     type: 'REQUEST_START',
  //     offset: currentOffset
  //   });
  // };

  // remove successful request obj from "requests"
  const onRequestSuccess = (currentOffset, actionCreator) => (response) => {
    dispatch(actionCreator(currentOffset));

    if (!isSearchTerminated) {
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

    console.log('RESPONSE from setResponseCount: ', response); // TEMP:

    return response;
  };

  return next => (action) => {
    const { accessToken } = getState();
    const {
      callAPI,
      parseResponse,
      searchConfig,
      addResults,
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

    if (typeof parseResponse !== 'function') {
      throw new Error('Expected parseResponse to be a function');
    }

    if (typeof addResults !== 'function') {
      throw new Error('Expected addResults to be function');
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
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      requestInterval,
      waitPending
    } = searchConfig;

    // doublecheck
    clearInterval(scannerIntervalId);
    // to notify reducers of search start
    // will also clear "requests" in store
    next(action);
    offset = 0;
    // results.length = 0;
    isSearchTerminated = false;

    const performSingleCall = (currentOffset) => {
      // add request obj with pending: true to in-store "requests"
      // onRequestStart(currentOffset);
      dispatch(requestStart(currentOffset));

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      // TODO: use timestamps - Date.now === timeout to track failed requests

      callAPI(currentAPIReqUrl)
        .then(
          onRequestSuccess(currentOffset, requestSuccess),
          onRequestFail(currentOffset, requestFail)
        )
        .then(setResponseCount)
        // then(parseResponse) with wrapper function in "searchPostsAtWall"
        .then(parseResponse(authorId)) // TODO: throw there
        // .then(collectResults)
        // TODO: replace by then(addPartOfResultsIfFound(searchResultsLimit))
        .then((chunk) => {
          // TODO: consider doublechecking with "isSearchTerminated"
          if (chunk && chunk.length > 0) {
            dispatch(addResults(chunk, searchResultsLimit));
          }
          return chunk;
        })
        // TODO: replace by then(handleSearchProgress)
        .then(() => {
          if (responseCount && !isSearchTerminated) {
            dispatch(updateSearchProgress(responseCount, offset));
          }
        })
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      const { requests } = getState();

      if (requests.length > 0) {
        const pendingReq = requests.find(request => request.pending);

        console.log('REQUESTS 4: ', JSON.stringify(requests, null, 2));

        if (pendingReq && waitPending) {
          return false;
        }

        // no pending requests, only failed requests present, repeat first
        if (!pendingReq) {
          console.log('Will call this FAILED request: ', requests[0].offset);

          performSingleCall(requests[0].offset);
          return false;
        }

        const failedReq = requests.find(request => !request.pending);

        // pending requests present but "waitPending" is false and failed
        // requests present, repeat first of failed
        if (failedReq) {
          console.log('Not waiting for pending and call: ', failedReq.offset);

          performSingleCall(failedReq.offset);
          return false;
        }

        // // "waitPending" is false, no failed reqs, but pending reqs present
        // if (pendingReq) {
        //   // need to call next offset
        //   return false;
        // }
      }

      if (getState().results.length < searchResultsLimit) { // was results.length
        if (!responseCount || offset < responseCount) {
          // NOTE: should vary depending on the "count" value
          offset += 100;
          return performSingleCall(offset);
        }
        // TODO: add requests.length > 0 for case when "waitPending" is false, 
        // no failed reqs, pending reqs present but offset > count
      }

      isSearchTerminated = true;
      clearInterval(scannerIntervalId);
      // return dispatch(completeSearch(results));
      return dispatch(completeSearch());

      // NOTE: maybe add exit condition when get empty items(posts) few times
      // if (responseData.items.length = 0) { ... }
    }, requestInterval);
    // to make first request before timer tick
    return performSingleCall(offset);
  };
};

export default scannerMiddleware;
