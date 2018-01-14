const scannerMiddleware = ({ dispatch, getState }) => {
  let failedRequests = [];
  let results = [];
  let scannerIntervalId;
  let offset = 0;
  let totalPostsAtWall = 5000; // NOTE: temporarily

  return next => (action) => {
    const { accessToken } = getState();
    const {
      callAPI,
      handleResponse,
      scanConfig,
      completeSearch,
      startSearch,
      stopSearch,
      type
    } = action;

    if ((type !== 'STOP_SEARCH' || !stopSearch) && !scanConfig) {
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

    if (typeof scanConfig !== 'object') {
      throw new Error('Expected an object of scan params');
    }

    const {
      authorId,
      baseAPIReqUrl,
      postsAmount,
      requestInterval,
      searchQuery
    } = scanConfig;

    // NOTE: doublecheck
    clearInterval(scannerIntervalId);
    // TODO: reset offset at new search start
    offset = 0;
    dispatch(startSearch());
    results.length = 0;
    failedRequests.length = 0;

    const getPartOfResults = currentOffset => (
      dispatch(callAPI(
        `${baseAPIReqUrl}&access_token=${accessToken}&offset=${currentOffset}`,
        currentOffset // TEMP: passing it temporarily
      ))
        .then((response) => {
          // TODO: remove successful one from "failedRequests"
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
        }, (e) => { /* TODO: catch failed requests and store it in [] */
          failedRequests.push({ offset: currentOffset, pending: false });
          console.warn(
            'Catch failed request with offset ', currentOffset,
            ' and error ', e
          );
        })
    );
    getPartOfResults(offset);

    scannerIntervalId = setInterval(() => {
      // const { results, failedRequests } = getState();

      if (results.length < postsAmount) {
        if (!totalPostsAtWall || offset < totalPostsAtWall) {
          // NOTE: must be depended on count variable
          offset += 100;
          return getPartOfResults(offset);
        }
      }

      // TODO: handle case with wrong wall owner id

      // TODO: add and check pending requests state                                !!!
      if (failedRequests.length > 0) {
        const req = failedRequests.find(failedReq => !failedReq.pending);
        if (req) {
          getPartOfResults(req.offset);
        }
        return false;
      }
      clearInterval(scannerIntervalId);
      // TODO: pass current results at end
      return dispatch(completeSearch());

      // NOTE: maybe add exit condition when get empty items(posts) few times
      // if (responseData.items.length = 0) { ... }
    }, requestInterval);
  };
};

export default scannerMiddleware;
