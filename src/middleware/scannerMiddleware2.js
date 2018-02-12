const scannerMiddleware = ({ dispatch, getState }) => {
  let failedRequests = {
    // 'offset300': {
    //   id: 7901,
    //   offset: 300,
    //   pending: false
    // },
    // 'offset700': {
    //   id: 2313,
    //   offset: 700,
    //   pending: true
    // }
  };
  // let emptyResponsesCount = 0; // idea
  // let results = [];
  let scannerIntervalId;
  let offset = 0;
  let responseCount;
  // TODO:
  let finished = false;

  // const responseCountDef = 5000; // NOTE: temporarily

  // const requests = [
  //   {
  //     offset: 400,
  //     pending: true,
  //     failCount: 0   // idea
  //   }
  // ];

  const genId = (n = 3) => (Math.random() * 1000000).toString().slice(0, n);

  const setFailedRequestAsPending = (currentOffset) => {
    const current = `offset${currentOffset}`;

    if (failedRequests[current]) {
      failedRequests[current].pending = true;
    }

    // console.log('REQUEST 1: ', JSON.stringify(failedRequests, null, 2), 'MUST BE SET ', currentOffset, 'as PENDING');
  };

  // remove successful one from "failedRequests"
  const removeFailedRequest = currentOffset => (response) => {
    const current = `offset${currentOffset}`;

    if (failedRequests[current]) {
      delete failedRequests[current];
    }

    // console.log('SUCCESS 2: ', currentOffset, 'MUST BE REMOVED from: ', JSON.stringify(failedRequests, null, 2));
    return response;
  };

  const onRequestFail = currentOffset => (e) => {
    const current = `offset${currentOffset}`;

    if (failedRequests[current]) {
      failedRequests[current].pending = false;
      // console.log('FAIL 3: ', JSON.stringify(failedRequests, null, 2), 'must SET ', current, ' as FAILED');
    } else {
      failedRequests[current] = {
        offset: currentOffset,
        id: genId(4),
        pending: false
      };
      // console.log('FAIL 3: ', JSON.stringify(failedRequests, null, 2), 'must ADD ', current, 'to FAILED');
    }

    throw Error(`Request with ${currentOffset} offset FAILED, ${e.message}`);
  };

  const setResponseCount = (response) => {
    responseCount = response && response.count
      ? response.count
      : responseCount;
    // console.log('RESPONSE from setResponseCount: ', response); // TEMP:
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
      handleResponse,
      searchConfig,
      completeSearch,
      saveResultsType,
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
      return next(action);
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function');
    }

    if (typeof handleResponse !== 'function') {
      throw new Error('Expected handleResponse to be a function');
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
    // results.length = 0;
    failedRequests = {};
    finished = false;

    const performSingleCall = (currentOffset) => {
      setFailedRequestAsPending(currentOffset);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      callAPI(currentAPIReqUrl)
        .then(removeFailedRequest(currentOffset), onRequestFail(currentOffset))
        .then(setResponseCount)
        .then(handleResponse(authorId)) // TODO: throw there
        // .then(collectResults)
        .then((chunk) => {
          if (chunk && chunk.length > 0) {
            dispatch({
              type: saveResultsType,
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

      const reqs = Object.keys(failedRequests);

      if (reqs.length > 0) {
        const failed = reqs.find(req => failedRequests[req].pending !== true);

        if (failed) {
          // console.log('Failed request FOUND, will call with: ', failed);

          performSingleCall(failedRequests[failed].offset);
        }
        // console.log('F-REQUESTS 4: ', JSON.stringify(failedRequests, null, 2));
        return false;
      }

      // TODO: need to resolve if store is not used
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
