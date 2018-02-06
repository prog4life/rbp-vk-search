const scannerMiddleware = ({ dispatch, getState }) => {
  let failedRequests = [];
  let emptyResponsesCount = 0; // for further usage
  let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount;
  // TODO:
  let finished = false;
  // NOTE: temporarily
  // const responseCountDef = 5000;
  // IDEA: store pending or failed requests
  // let requests = [
  //   {
  //     offset: 400,
  //     pending: true,
  //     failed: false,
  //     failCount: 0
  //   }
  // ];

  const setFailedRequestAsPending = (currentOffset) => {
    console.log('REQUEST: ', currentOffset);
    // change "pending" status of request to "true" at repeated request with
    // same offset value
    failedRequests.forEach((req) => {
      if (req.offset === currentOffset) {
        req.pending = true;
        console.log('REQUEST 1: ', failedRequests, 'must SET ', currentOffset, 'as PENDING');
        console.log('But have ', req);
      }
    });
  };

  // remove successful one from "failedRequests"
  const removeFailedRequest = currentOffset => (response) => {
    console.log(currentOffset, ' SUCCESS');

    // NOTE: consider mutating same array here
    failedRequests = failedRequests.filter(req => req.offset !== currentOffset);

    console.log('SUCCESS 2: ', failedRequests, 'must REMOVE ', currentOffset, 'from failed');

    return response;
  };

  const onRequestFail = currentOffset => (e) => {
    const existing = failedRequests.find(req => req.offset === currentOffset);

    if (existing) {
      existing.pending = false;
      console.log('FAIL 3: ', failedRequests, 'must SET ', currentOffset, 'as FAILED');
    } else {
      failedRequests.push({ offset: currentOffset, pending: false });
      console.log('FAIL 4: ', failedRequests, 'must ADD ', currentOffset, 'to FAILED');
    }
    throw Error(`Request with ${currentOffset} offset FAILED, ${e.message}`);
  };

  const setResponseCount = (response) => {
    // TODO: remove responseCountDef completely
    responseCount = (response && response.count) || responseCount;
    // responseCount = response.count && response.count < responseCountDef
    //   ? response.count
    //   : responseCountDef;
    return response;
  };

  const updateSearchProgress = (resultsChunk) => {
    // TODO: if search is terminated - do not continue
    // if (finished) { return false; }
    if (responseCount) {
      dispatch({
        type: 'UPDATE_SEARCH_PROGRESS',
        total: responseCount,
        processed: offset
      });
    }
    return resultsChunk;
  };

  // const addOrResetFailedRequest = (currentOffset) => {
  //   const existing = failedRequests.find(req => req.offset === currentOffset);
  //   if (existing) {
  //     existing.pending = false;
  //   } else {
  //     failedRequests.push({ offset: currentOffset, pending: false });
  //   }
  //   console.log('F-REQUESTS 3: ', failedRequests, 'must SET ', currentOffset, 'as FAILED');
  // };

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
      return next(action); // OR "failedRequests", "results"
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
      throw new Error('Expected an object of scan params');
    }

    const {
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      requestInterval
    } = searchConfig;

    // doublecheck
    clearInterval(scannerIntervalId);
    // dispatch({ type }); // TODO: replaced by next(action) to avoid
    // dispatching of empty action witn "SOME_START" type
    next(action);
    offset = 0;
    results.length = 0;
    failedRequests.length = 0;
    finished = false;

    const performSingleCall = (currentOffset) => {
      setFailedRequestAsPending(currentOffset);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      callAPI(currentAPIReqUrl)
        .then(removeFailedRequest(currentOffset), onRequestFail(currentOffset))
        // TODO: extract then(checkResponse)
        .then(setResponseCount)
        .then(parseResponse(authorId)) // TODO: throw there
        .then(updateSearchProgress)
        // TODO: extract as single then(addResults)
        // TODO: cut results with "searchResultsLimit"
        .then((chunk) => {
          // to collect results in this middleware too (optionally)
          if (chunk && chunk.length > 0) {
            // TODO: prevent adding duplicate results
            results = results.concat(chunk);
            dispatch({
              type: addResultsType,
              results: chunk
            });
          }
        })
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      // TODO: handle case with wrong wall owner id

      if (failedRequests.length > 0) {
        const req = failedRequests.find(failedReq => !failedReq.pending);
        if (req) {
          console.log('F-REQUESTS 4: ', failedRequests);
          performSingleCall(req.offset);
        }
        return false;
      }

      if (results.length < searchResultsLimit) {
        if (!responseCount || offset < responseCount) {
          // NOTE: should vary depending on the "count" value
          offset += 100;
          return performSingleCall(offset);
        }
      }

      finished = true;
      clearInterval(scannerIntervalId);
      return dispatch(completeSearch(results));

      // NOTE: maybe add exit condition when get empty items(posts) few times
      // if (responseData.items.length = 0) { ... }
    }, requestInterval);
    // make first request without timer
    return performSingleCall(offset);
  };
};

export default scannerMiddleware;
