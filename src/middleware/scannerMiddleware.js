const scannerMiddleware = ({ dispatch, getState }) => {
  const { accessToken } = getState();
  const types = ['START_SCAN', 'STOP_SCAN'];
  const failedRequests = [];
  const results = [];
  let scannerIntervalId;
  let offset = 0;
  let totalPostsAtWall = 5000; // NOTE: temporarily

  return next => (action) => {
    const {
      callAPIHandler,
      responseHandler,
      scanEndHandler,
      scanConfig,
      type
    } = action;

    const {
      authorId,
      baseAPIReqUrl,
      postsAmount,
      requestInterval,
      searchQuery
    } = scanConfig;

    if (!scanEndHandler || !types.includes(type)) {
      return next(action);
    }

    if (typeof callAPIHandler !== 'function') {
      throw new Error('Expected callAPIHandler to be a function');
    }

    if (typeof responseHandler !== 'function') {
      throw new Error('Expected responseHandler to be a function');
    }

    if (typeof scanEndHandler !== 'function') {
      throw new Error('Expected scanEndHandler to be a function');
    }

    // NOTE: doublecheck
    clearInterval(scannerIntervalId);
    // TODO: reset offset at new search
    offset = 0;
    dispatch({ type: 'CLEAR_RESULTS' });
    results.length = 0;

    const getPartOfResults = currentOffset => (
      dispatch(callAPIHandler(
        `${baseAPIReqUrl}&access_token=${accessToken}&offset=${currentOffset}`,
        currentOffset
      ))
        .then((response) => {
          // totalPostsAtWall = response.count && response.count < totalPostsDef
          //   ? response.count
          //   : totalPostsDef;
          // TODO: remove totalPostsDef completely
          // return response;
          dispatch(responseHandler(response, authorId, postsAmount));
        } /* TODO: catch failed request and store it in [] */)
    );

    scannerIntervalId = setInterval(() => {
      // const { results, failedRequests } = getState();

      // NOTE: temporarily done by single action
      // dispatch(sortResults(false));
      // dispatch(cutExcessResults(postsAmount));
      if (results.length < postsAmount) {
        if (!totalPostsAtWall || offset < totalPostsAtWall) {
          // NOTE: must depend on count var
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
      // TODO: pass current results at end
      return dispatch(scanEndHandler(scannerIntervalId));

      // NOTE: maybe add exit condition when get empty items(posts) few times
      // if (responseData.items.length = 0) { ... }
    }, requestInterval);
  };
};

export default scannerMiddleware;
