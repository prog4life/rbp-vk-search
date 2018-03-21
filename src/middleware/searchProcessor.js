import axiosJSONP from 'utils/axiosJSONP';
// import fetchJSONP from 'utils/fetch';
import prepareWallPosts from 'utils/responseHandling';
import { maxAttempts as maxAttemptsDefault } from 'config/common';

export const SEARCH_CONFIG = 'Search Config';

// IDEA
export const kindsOfData = {
  wallPosts: 'WALL_POSTS',
  // wallComments: 'WALL_COMMENTS'
};

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: not repeat pending, just make them failed instead; Belated Overdue
// const checkAndRepeatFailed = () => {}

const searchProcessor = ({ dispatch, getState }) => {
  let scannerIntervalId;
  // const search = {
  //   isActive: false,
  //   offset: 0
  //   total: undefined, // total amount of items to search among
  //   processed: 0,
  // };

  // const requests = {
  //   'offset_400': {
  //     id: 'offset_400'
  //     offset: 400,
  //     attempts: 1, // how many times request was sent/sent again
  //     startTime: integer // Date.now() value
  //     isPending: true, // failed request will get "false" value here
  //   }
  // };

  const onRequestStart = (next, offset, attempts) => {
    const key = `offset_${offset}`;

    next({
      type: 'REQUEST_START',
      id: key,
      offset,
      startTime: Date.now(),
      attempts,
    });
  };

  // remove successful request obj from "requests"
  const onRequestSuccess = (next, getState, offset) => (response) => {
    const { search: searchState, requests } = getState();

    if (!searchState.isActive) {
      throw Error(`Needless response, offset: ${offset}, search is over`);
    }
    const key = `offset_${offset}`;

    // if other request with such offset has been succeeded(removed) already
    if (!requests[key]) {
      throw Error(`Other request with ${offset} offset has succeeded earlier`);
    }
    next({
      type: 'REQUEST_SUCCESS',
      id: key,
    });
    // add searchState for chained further onSearchProgress handler
    return { response, searchState };
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (next, getState, offset, attempts) => (e) => {
    const { search: { isActive }, requests } = getState();

    if (!isActive) {
      throw Error(`Needless failed request ${offset}, search is over already`);
    }
    const key = `offset_${offset}`;
    // if other request with same offset was successful (and therefore was
    // removed from "requests") - no need to add this one failed
    if (!requests[key]) {
      throw Error(`Other request with ${offset} offset have succeeded ` +
        `earlier, attempt ${attempts} became unnecessary`);
    }
    // to check that it's fail of latest attempt, not one that was considered
    // as failed earlier (due to exceeding of waitTimeout)
    if (requests[key].attempts === attempts) {
      next({
        type: 'REQUEST_FAIL',
        id: key,
        offset,
        startTime: requests[key].startTime,
        attempts,
      });
      throw Error(`Request with ${offset} offset failed, ${e.message}`);
    }
    throw Error(`Request with ${offset} offset was resended ` +
      `${requests[key].attempts} time, ignoring result of ${attempts} attempt`);
  };

  const onSearchProgress = (next, offset, offsetModifier, type) => (
    ({ response, searchState }) => {
      const { total, processed, progress } = searchState;

      console.log('search progress state: ', searchState);
      // to get updated "total"
      const nextTotal = response && response.count ? response.count : total;
      const itemsLength = response && response.items && response.items.length;

      let nextProcessed = processed;

      if (itemsLength) {
        nextProcessed += itemsLength;
      }

      if (nextTotal !== total || nextProcessed !== processed) {
        let nextProgress = progress;
        // count progress in percents
        if (Number.isInteger(nextTotal) && Number.isInteger(nextProcessed)) {
          // return Number(((nextProcessed / nextTotal) * 100).toFixed());
          nextProgress = Math.round(((nextProcessed / nextTotal) * 100));
        }
        console.info(`next processed ${nextProcessed}, total ${nextTotal} ` +
          ` and progress ${nextProgress}`);
        next({
          type,
          total: nextTotal,
          processed: nextProcessed,
          progress: nextProgress,
        });
      }
      return response;
    }
  );

  const savePartOfResults = (next, limit, addResultsType) => (chunk) => {
    if (chunk && chunk.length > 0) {
      next({
        type: addResultsType,
        results: chunk,
        limit,
      });
    }
    return chunk;
  };

  return next => (action) => {
    const { accessToken } = getState();
    // TODO: destructure from action callAPI and handleResponse functions with
    // imported defaults
    const { type, types } = action;
    const searchConfig = action[SEARCH_CONFIG];

    if (typeof searchConfig === 'undefined' && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    if (!types && type !== 'SEARCH_TERMINATE') {
      return next(action);
    }

    if (type === 'SEARCH_TERMINATE') {
      clearInterval(scannerIntervalId);
      return next(action);
    }

    if (!Array.isArray(types) || types.length !== 4) {
      throw new Error('Expected an array of seven action types.');
    }
    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object of search config params');
    }
    if (!types.every(t => typeof t === 'string')) {
      throw new Error('Expected action types to be strings');
    }

    const [
      searchStartType,
      addResultsType,
      updateSearchType,
      searchEndType,
    ] = types;

    // TODO: import offsetModifier, requestInterval, waitPending and waitTimeout
    // from common config and set as defaults here
    const {
      // TODO: not destructure authorId here and pass whole searchConfig obj to
      // handleResponse(prepareWallPosts)
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      waitPending,
      waitTimeout,
      maxAttempts = maxAttemptsDefault,
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(scannerIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });

    let checkpoint = performance.now(); // TEMP:
    let checkpoint2 = performance.now(); // TEMP:

    const makeCallToAPI = (offset, attempts = 1) => {
      const tempCheckpoint2 = checkpoint2;
      checkpoint2 = performance.now();
      console.warn(`NEW REQUEST with ${offset} offset, attempt: ` +
        `${attempts}, interval: ${checkpoint2 - tempCheckpoint2} and shift: ${performance.now() - checkpoint}`);
      // add request obj with isPending: true to "requests"
      onRequestStart(next, offset, attempts);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${offset}`;

      // NOTE: in all next chain must be used offset value that was actual
      // at interval tick moment, i.e. passed to "makeCallToAPI"
      axiosJSONP(currentAPIReqUrl)
        .then(
          // TODO: maybe it will be rational to get attempts value from
          //  existing request with same key
          onRequestSuccess(next, getState, offset),
          onRequestFail(next, getState, offset, attempts)
        )
        .then(onSearchProgress(
          next,
          offset,
          offsetModifier,
          updateSearchType,
        ))
        // TODO: change to more generic then(handleResponse(searchConfig))
        .then(prepareWallPosts(authorId))
        .then(savePartOfResults(next, searchResultsLimit, addResultsType))
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      const tempCheckpoint = checkpoint;
      checkpoint = performance.now();
      console.warn(`NEW interval TICK: ${checkpoint - tempCheckpoint}`);

      const { results, requests, search: { offset, total } } = getState();
      const reqs = Object.values(requests);
      let nextOffset;

      // TODO: think over search.isActive check
      if (reqs.length > 0) {
        // console.log('REQUESTS LEFT: ', JSON.stringify(reqs, null, 2));
        let nonOverduePending;
        // check for overdue pending requests
        reqs.forEach((req) => {
          if (!req.isPending) {
            return;
          }
          const { id, startTime, attempts } = req;
          const elapsed = Date.now() - startTime;

          if (elapsed > waitTimeout) {
            console.warn(`EXPIRED PENDING with offset: ${req.offset} and attempts ${attempts}, ELAPSED: ${elapsed}`);
            next({
              type: 'REQUEST_FAIL',
              id,
              offset: req.offset,
              startTime,
              attempts,
            });
          } else {
            nonOverduePending = req;
          }
        });
        // const pendingReq = reqs.some(request => request.isPending);
        if (nonOverduePending && waitPending) {
          return;
        }
        const failedReq = reqs.find(req => (
          !req.isPending && req.attempts < maxAttempts
        ));
        // no pending requests OR "waitPending" is false and failed requests
        // present - in both cases repeat first failed request
        if (failedReq) {
          console.log(`Not waiting and call FAILED with ${failedReq.offset} ` +
            `offset and attempt ${failedReq.attempts + 1} `);

          makeCallToAPI(failedReq.offset, failedReq.attempts + 1);
          return;
        }
        nextOffset = offset + offsetModifier;
        // no failed requests, "waitPending" is false,
        // all offsets processed but some pending requests are still present
        if (nextOffset > total) { // TODO: add !total ?
          nextOffset -= offsetModifier;
          // NOTE: or just not add such requests to "requests" on start
          // OR just count them and do: reqs.length - completelyFailed.length === 0
          // to remove requests that have exceeded their max attempts limit
          const completelyFailed = reqs.filter(req => (
            !req.isPending && req.attempts >= maxAttempts
          ));
          console.warn('completelyFailed: ', completelyFailed);
          // console.info('requests after completelyFailed were removed: ', requests);
          return;
        }
      } else {
        nextOffset = offset + offsetModifier;
      }
      next({ type: 'SET_OFFSET', offset: nextOffset });

      if (!searchResultsLimit || results.length < searchResultsLimit) {
        // request next portion of items using increased offset OR end search
        if (!total || nextOffset <= total) {
          makeCallToAPI(nextOffset);
          return;
        }
      }

      // TODO: replace by if (reqs.length - completelyFailed.length === 0)
      if (reqs.length === 0) {
        clearInterval(scannerIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return makeCallToAPI(getState().search.offset);
  };
};

export default searchProcessor;

// export default function createSearchProcessor(callAPI) {
//   return ({ getState, dispatch }) => next => (action) => {

//   };
// }

// const belated = checkBelated(reqs, waitTimeout);
//
// if (belated) {
//   console.log(`REPEAT EXPIRED PENDING with offset: ${belated.offset}
//     and attempts: ${belated.attempts + 1}`);
//   makeCallToAPI(belated.offset, belated.attempts + 1);
//   return;
// }

function checkBelated(reqs, waitTimeout) {
  // to send again pending request that have exceeded waitTimeout but
  // have not exceeded maxAttemptsLimit yet
  // return reqs.find(request => (
  //   request.isPending && Date.now() - request.startTime > waitTimeout
  //   && belated.attempts < maxAttemptsPending
  // ));
  return reqs.find((req) => {
    const elapsed = Date.now() - req.startTime;

    if (req.isPending
      && elapsed > waitTimeout) {
      // && req.attempts < maxAttemptsPending) {
      console.warn(`EXPIRED PENDING with offset: ${req.offset} and attempts ${req.attempts}, ELAPSED: ${elapsed}`);
      return true;
    }
    return false;
  });
}
