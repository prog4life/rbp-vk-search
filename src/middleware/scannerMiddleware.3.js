const searchProcessor = ({ dispatch, getState }) => {
  let failedRequests = {
    // 'offset300': {
    //   id: 7901,
    //   offset: 300,
    //   isPending: false
    // },
    // 'offset700': {
    //   id: 2313,
    //   offset: 700,
    //   isPending: true
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
  //     isPending: true,
  //     failCount: 0   // idea
  //   }
  // ];

  const genId = (n = 3) => (Math.random() * 1000000).toString().slice(0, n);

  const setFailedRequestAsPending = (currentOffset) => {
    const current = `offset${currentOffset}`;

    if (failedRequests[current]) {
      failedRequests[current].isPending = true;
    }

    // console.log('REQUEST 1: ', JSON.stringify(failedRequests, null, 2), 'MUST BE SET ', currentOffset, 'as isPending');
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
      failedRequests[current].isPending = false;
      // console.log('FAIL 3: ', JSON.stringify(failedRequests, null, 2), 'must SET ', current, ' as FAILED');
    } else {
      failedRequests[current] = {
        offset: currentOffset,
        id: genId(4),
        isPending: false
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
  //     existing.isPending = false;
  //   } else {
  //     failedRequests.push({ offset: currentOffset, isPending: false });
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
      addResultsType,
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

    const makeCallToAPI = (currentOffset) => {
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
              type: 'SEARCH_UPDATE',
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
        const failed = reqs.find(req => failedRequests[req].isPending !== true);

        if (failed) {
          // console.log('Failed request FOUND, will call with: ', failed);

          makeCallToAPI(failedRequests[failed].offset);
        }
        // console.log('F-REQUESTS 4: ', JSON.stringify(failedRequests, null, 2));
        return false;
      }

      // TODO: need to resolve if store is not used
      if (getState().results.length < searchResultsLimit) { // was results.length
        if (!responseCount || offset < responseCount) {
          // NOTE: should vary depending on the "count" value
          offset += 100;
          return makeCallToAPI(offset);
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
    return makeCallToAPI(offset);
  };
};

export default searchProcessor;