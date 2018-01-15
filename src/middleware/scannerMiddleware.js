const scannerMiddleware = ({ dispatch, getState }) => {
  let failedRequests = [];
  // let requests = [
  //   {
  //     offset: 400,
  //     pending: true,
  //     failed: false
  //   }
  // ];
  let results = [];
  let scannerIntervalId;
  let offset = 0;
  let totalPostsAtWall = 5000; // NOTE: temporarily

  const setFailedRequestAsPending = (currentOffset) => {
    // if it was failed request with such offset, change its pending status
    // to true on repeated request
    failedRequests = failedRequests.map((req) => {
      if (req.offset === currentOffset) {
        return { offset: currentOffset, pending: true };
      }
      return req;
    });
  };

  const addOrResetFailedRequest = (currentOffset) => {
    const existing = failedRequests.find(req => req.offset === currentOffset);
    if (existing) {
      existing.pending = false;
    } else {
      failedRequests.push({ offset: currentOffset, pending: false });
    }

    // let exist = false;
    // failedRequests = failedRequests.map((req) => {
    //   if (req.offset === currentOffset) {
    //     exist = true;
    //     return { offset: currentOffset, pending: false };
    //   }
    //   return req;
    // });
    //
    // if (!exist) {
    //   failedRequests.push({ offset: currentOffset, pending: false });
    // }
  };

  const removeFailedRequest = (currentOffset) => {
    // remove successful one from "failedRequests"
    failedRequests = failedRequests.filter(req => req.offset !== currentOffset);
  };

  return next => (action) => {
    const { accessToken } = getState();
    const {
      callAPI,
      handleResponse,
      searchConfig,
      completeSearch,
      startSearch,
      stopSearch,
      type
    } = action;

    if ((type !== 'STOP_SEARCH' || !stopSearch) && !searchConfig) {
      return next(action);
    }

    if (type === 'STOP_SEARCH' && stopSearch) {
      clearInterval(scannerIntervalId);

      // dispatch({ type: scanStopType });
      dispatch(stopSearch());

      return results; // OR "failedRequests"
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
      postsAmount,
      requestInterval,
      searchQuery
    } = searchConfig;

    // NOTE: doublecheck
    clearInterval(scannerIntervalId);
    // TODO: reset offset at new search start
    offset = 0;
    dispatch(startSearch());
    results.length = 0;
    failedRequests.length = 0;

    const performSingleCall = (currentOffset) => {
      setFailedRequestAsPending(currentOffset);

      console.log('REQUEST with offset: ', currentOffset);

      const currentAPIReqUrl = `${baseAPIReqUrl}&access_token=${accessToken}` +
        `&offset=${currentOffset}`;

      // TEMP: pass currentOffset temporarily
      dispatch(callAPI(currentAPIReqUrl, currentOffset)).then(
        (response) => {
          removeFailedRequest(currentOffset);
          console.log('SUCCESS with offset: ', currentOffset);
          // totalPostsAtWall = response.count && response.count < totalPostsDef
          //   ? response.count
          //   : totalPostsDef;
          // TODO: remove totalPostsDef completely
          // return response;
          const chunk = dispatch(handleResponse(
            response,
            authorId,
            postsAmount
          ));
          results = chunk && chunk.length > 0 ? results.concat(chunk) : results;
        },
        (e) => { /* TODO: catch failed requests and store it in [] */
          addOrResetFailedRequest(currentOffset);
          console.warn(
            'Catch failed request with offset ', currentOffset,
            ' and ', e
          );
        }
      );
    };

    scannerIntervalId = setInterval(() => {
      // TODO: handle case with wrong wall owner id

      if (failedRequests.length > 0) {
        const req = failedRequests.find(failedReq => !failedReq.pending);
        if (req) {
          performSingleCall(req.offset);
        }
        return false;
      }

      if (results.length < postsAmount) {
        if (!totalPostsAtWall || offset < totalPostsAtWall) {
          // NOTE: must be depended on count variable
          offset += 100;
          return performSingleCall(offset);
        }
      }

      clearInterval(scannerIntervalId);
      // TODO: pass current results at end
      return dispatch(completeSearch(results));

      // NOTE: maybe add exit condition when get empty items(posts) few times
      // if (responseData.items.length = 0) { ... }
    }, requestInterval);
    // make first request without timer
    return performSingleCall(offset);
  };
};

export default scannerMiddleware;
