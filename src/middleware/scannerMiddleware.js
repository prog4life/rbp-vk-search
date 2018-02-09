const scannerMiddleware = ({ dispatch, getState }) => {
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount;
  // TODO:
  let finished = false;

  // const requests = [
  //   {
  //     offset: 400,
  //     pending: true,
  //     failCount: 0   // idea
  //   }
  // ];

  const requestPending = (currentOffset) => {
    dispatch({
      type: 'REQUEST_PENDING',
      offset: currentOffset
    });
  };

  // remove successful one from "requests"
  const requestSuccess = currentOffset => (response) => {
    dispatch({
      type: 'REQUEST_SUCCESS',
      offset: currentOffset
    });
    return response;
  };

  const requestFail = currentOffset => (e) => {
    // TODO: add if (!finished) check
    dispatch({
      type: 'REQUEST_FAIL',
      offset: currentOffset
    });
    throw Error(`Request with ${currentOffset} offset FAILED, ${e.message}`);
  };

  const setResponseCount = (response) => {
    responseCount = response && response.count
      ? response.count
      : responseCount;

    console.log('RESPONSE from setResponseCount: ', response); // TEMP:

    return response;
  };

  // to collect results in this middleware too (optionally)
  // const collectResults = (resultsChunk) => {
  //   if (resultsChunk && resultsChunk.length > 0) {
  //     // TODO: prevent adding duplicate results
  //     results = results.concat(resultsChunk);
  //     return resultsChunk;
  //   }
  //   return false;
  // };

  // const addOrResetFailedRequest = (currentOffset) => {
  //   const existing = requests.find(req => req.offset === currentOffset);
  //   if (existing) {
  //     existing.pending = false;
  //   } else {
  //     requests.push({ offset: currentOffset, pending: false });
  //   }
  //   console.log('F-REQUESTS 3: ', requests, 'must SET ', currentOffset, 'as FAILED');
  // };

  // TODO: add to action "responseStateTypes" field

  return next => (action) => {
    const { accessToken } = getState();
    const {
      callAPI,
      parseResponse,
      searchConfig,
      completeSearch,
      addResultsType,
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
      finished = true;
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

    if (typeof completeSearch !== 'function') {
      throw new Error('Expected completeSearch to be a function');
    }

    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object of search config params');
    }

    const {
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      requestInterval,
      waitPrevRequest
    } = searchConfig;

    // doublecheck
    clearInterval(scannerIntervalId);
    // dispatch({ type }); // TODO: replaced by next(action) to avoid
    // dispatching of empty action witn "SOME_START" type
    next(action);
    offset = 0;
    // results.length = 0;
    // TODO: clear failedReuests in store:
    // dispatch({ type: 'CLEAR_REQUESTS' });
    finished = false;

    const performSingleCall = (currentOffset) => {
      requestPending(currentOffset);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      // TODO: use timestamps - Date.now === timeout to track failed requests

      callAPI(currentAPIReqUrl)
        .then(requestSuccess(currentOffset), requestFail(currentOffset))
        .then(setResponseCount)
        .then(parseResponse(authorId)) // TODO: throw there
        // .then(collectResults)
        .then((chunk) => {
          if (chunk && chunk.length > 0) {
            dispatch({
              type: addResultsType,
              results: chunk,
              limit: searchResultsLimit // to cut results from within reducer
            });
          }
          return chunk;
        })
        .then(() => {
          if (responseCount && !finished) {
            dispatch({
              type: 'UPDATE_SEARCH_PROGRESS',
              total: responseCount,
              processed: offset
            });
          }
        })
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      // TODO: handle case with wrong wall owner id

      // TODO: waitPending/sequential config: that determines to make or not
      // new reqest if pending requests present

      const { requests } = getState();

      if (requests.length > 0) {
        const pendingReq = requests.find(request => request.pending);

        console.log('REQUESTS 4: ', JSON.stringify(requests, null, 2));

        if (pendingReq && waitPrevRequest) {
          return false;
        }

        // only failed requests present, no pending requests, repeat first
        if (!pendingReq) {
          console.log('Will call this FAILED request: ', requests[0].offset);

          performSingleCall(requests[0].offset);
          return false;
        }
      }

      if (getState().results.length < searchResultsLimit) { // was results.length
        if (!responseCount || offset < responseCount) {
          // NOTE: should vary depending on the "count" value
          offset += 100;
          return performSingleCall(offset);
        }
      }

      finished = true;
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
