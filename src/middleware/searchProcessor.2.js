import axiosJSONP from 'utils/axiosJSONP';
// import fetchJSONP from 'utils/fetch';
import prepareWallPosts from 'utils/responseHandling';
import {
  maxAttemptsPending as maxAttemptsPendingDefault,
  maxAttempts as maxAttemptsDefault
} from 'config/common';

export const SEARCH_CONFIG = 'Search Config';

export const kindsOfData = {
  wallPosts: 'WALL_POSTS'
  // wallComments: 'WALL_COMMENTS'
};

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// const checkAndRepeatBelated = () => {} // OR name it Overdue
// const checkAndRepeatFailed = () => {}

// TODO: rename to searchProcessor, extractor, e.t.c
const searchProcessor = ({ dispatch, getState }) => {
  const search = {
    // isActive: false,
    offset: 0 // TODO: rename to currentOffset
    // total: undefined, // total amount of items to search among
    // processed: 0,
  };
  const processedOffsets = []; // offsets of successful requests
  let scannerIntervalId;
  let requests = {};

  // const requests = {
  //   'offset_400': {
  //     id: 'offset_400'
  //     offset: 400,
  //     // how many times unresponded pending or failed request was sent again
  //     attempts: 0
  //     startTime: Number // Date.now() value
  //     isPending: true, // failed request will get "false" value here
  //     isDone: false // was removed
  //   }
  // };

  const onRequestStart = (offset, attempts) => {
    const key = `offset_${offset}`;

    requests[key] = {
      id: key,
      offset,
      startTime: Date.now(),
      attempts,
      isPending: true
    };
  };

  // remove successful request obj from "requests"
  const onRequestSuccess = (getState, offset) => (response) => {
    const { search: searchState } = getState();

    if (searchState.isActive) {
      const key = `offset_${offset}`;

      delete requests[key];
      // add searchState for chained next onSearchProgress handler
      return { response, searchState };
    }
    throw Error(`Needless response, offset: ${offset}, search is over already`);
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (getState, offset, attempts) => (e) => {
    const { isActive } = getState().search;

    if (!isActive) {
      throw Error(`Needless failed request ${offset}, search is over already`);
    }
    const key = `offset_${offset}`;
    // if other request with same offset was successful (and therefore deleted
    // from "requests") - no need to add this one
    if (!requests[key]) {
      throw Error(`Request with ${offset} offset got response already, ` +
        `attempt ${attempts} was unnecessary`);
    }
    // to check that it's fail of same request, not skipped earlier one
    if (requests[key].attempts === attempts) {
      const { startTime } = requests[key];

      requests[key] = {
        id: key,
        offset,
        startTime,
        attempts,
        isPending: false
      };
      throw Error(`Request with ${offset} offset failed, ${e.message}`);
    }
    throw Error(`Request with ${offset} offset was repeated ` +
      `${requests[key].attempts} time, skip response for attempt ${attempts}`);
  };

  // const updateResponseCount = searchState => (response) => {
  //   searchState.total = response && response.count
  //     ? response.count
  //     : searchState.total;
  //   return response;
  // };

  const onSearchProgress = (next, offsets, offset, offsetModifier, type) => (
    ({ response, searchState }) => {
      const { isActive, total, processed } = searchState;

      if (isActive) {
        console.log('search progress state: ', searchState);
        // to get updated "total"
        const resCount = response && response.count ? response.count : total;
        const itemsLength = response && response.items && response.items.length;

        let updated = processed;

        if (offsets.indexOf(offset) === -1 && itemsLength) {
          offsets.push(offset);
          updated += itemsLength;
        }

        if (resCount !== total || updated !== processed) {
          console.info(`next processed ${updated} and total ${resCount}`);
          next({
            type,
            total: resCount,
            processed: updated
          });
        }
      }
      return response;
    }
  );

  const savePartOfResults = (next, limit, addResultsType) => (chunk) => {
    if (chunk && chunk.length > 0) {
      // NOTE: more suitable to use "next" instead of dispatch
      next({
        type: addResultsType,
        results: chunk,
        // oredr: 'desc',
        limit
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
      // search.isActive = false;
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
      searchEndType
    ] = types;

    // TODO: import offsetModifier, requestInterval, waitPending and waitTimeout
    // from common config and set as defaults here
    const {
      // TODO: not destructure authorId here and pass whole searchConfig obj to
      // handleResponse (prepareWallPosts)
      authorId,
      baseAPIReqUrl,
      searchResultsLimit,
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      waitPending,
      waitTimeout,
      maxAttemptsPending = maxAttemptsPendingDefault,
      maxAttempts = maxAttemptsDefault
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(scannerIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });
    requests = {};
    search.offset = 0;
    // search.processed = 0;
    // search.isActive = true;
    // search.processedOffsets.length = 0;
    processedOffsets.length = 0;
    // results.length = 0;

    let checkpoint = performance.now(); // TEMP:
    let checkpoint2 = performance.now(); // TEMP:

    const makeCallToAPI = (offset = 0, attempts = 1) => {
      const tempCheckpoint2 = checkpoint2;
      checkpoint2 = performance.now();
      console.warn(`NEW REQUEST with ${offset} offset, attempt: ` +
        `${attempts}, interval: ${checkpoint2 - tempCheckpoint2} and shift: ${performance.now() - checkpoint}`);
      // add request obj with isPending: true to "requests"
      onRequestStart(offset, attempts);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${offset}`;

      // NOTE: in all next chain must be used offset value that was actual
      // at interval tick moment, i.e. passed to "makeCallToAPI"
      axiosJSONP(currentAPIReqUrl)
        .then(
          // TODO: maybe it will be rational to get attempts value from
          //  existing request with same key
          onRequestSuccess(getState, offset),
          onRequestFail(getState, offset, attempts)
        )
        // .then(updateResponseCount(search))
        .then(onSearchProgress(
          next,
          processedOffsets,
          offset,
          offsetModifier,
          updateSearchType
        ))
        // TODO: change to more generic then(handleResponse(searchConfig))
        .then(prepareWallPosts(authorId))
        // .then(collectResults)
        .then(savePartOfResults(next, searchResultsLimit, addResultsType))
        .catch(e => console.error(e));
    };

    scannerIntervalId = setInterval(() => {
      const { offset } = search;
      let nextOffset;

      const tempCheckpoint = checkpoint;
      checkpoint = performance.now();
      console.warn(`NEW REQUEST interval: ${checkpoint - tempCheckpoint}`);

      const { results, search: { total } } = getState();

      // TODO: think over search.isActive check

      const reqs = Object.values(requests);

      if (reqs.length > 0) {
        console.log('REQUESTS LEFT: ', JSON.stringify(reqs, null, 2));

        // to send again pending request that have exceeded waitTimeout but
        // have not exceeded maxAttemptsLimit yet
        // const belated = reqs.find(request => (
        //   request.isPending && Date.now() - request.startTime > waitTimeout
        //   && belated.attempts < maxAttemptsPending
        // ));
        const belated = reqs.find((req) => {
          const difference = Date.now() - req.startTime;

          if (req.isPending
            && difference > waitTimeout
            && req.attempts < maxAttemptsPending) {
            console.warn(`EXPIRED PENDING with offset: ${req.offset} and attempts ${req.attempts}, DIFFERENCE: ${difference}`);
            return true;
          }
          return false;
        });

        if (belated) {
          console.log(`REPEAT EXPIRED PENDING with offset: ${belated.offset} and attempts: ${belated.attempts + 1}`);
          makeCallToAPI(belated.offset, belated.attempts + 1);
          return;
        }

        const pendingReq = reqs.some(request => request.isPending);

        if (pendingReq && waitPending) {
          return;
        }

        const failedReq = reqs.find(req => (
          // !req.isPending && !req.isDone && req.attempts < maxAttempts
          !req.isPending && req.attempts < maxAttempts
        ));

        // no pending requests OR "waitPending" is false and failed requests
        // present - in both cases repeat first failed request
        if (failedReq) {
          console.log(`Not waiting and call FAILED with ${failedReq.offset} ` +
            `offset and ${failedReq.attempts + 1} attempt`);

          makeCallToAPI(failedReq.offset, failedReq.attempts + 1);
          return;
        }
        // const { total: tempTotal } = getState().search;

        nextOffset = offset + offsetModifier;
        // no failed requests, "waitPending" is false,
        // all items requested but some pending requests that have not exceeded
        // waitTimeout may be still present
        if (nextOffset > total) { // TODO: add !tempTotal ?
          nextOffset -= offsetModifier;

          // NOTE: or just not add such requests to "requests" on start
          // to remove requests that have exceeded their max attempts limit
          const exceeded = reqs.filter(req => (
            (req.isPending && req.attempts >= maxAttemptsPending) ||
            (!req.isPending && req.attempts >= maxAttempts)
          ));
          console.warn('exceeded: ', exceeded);
          exceeded.forEach(req => delete requests[req.id]);
          console.info('requests after exceeded were removed: ', requests);
          return;
        }
      } else {
        nextOffset = offset + offsetModifier;
      }
      search.offset = nextOffset;

      // const { results, search: { total } } = getState();

      if (!searchResultsLimit || results.length < searchResultsLimit) {
        // request next portion of items using increased offset OR end search
        if (!total || nextOffset <= total) {
          makeCallToAPI(nextOffset);
          return;
        }
      }

      if (reqs.length === 0) {
        clearInterval(scannerIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return makeCallToAPI(search.offset);
  };
};

export default searchProcessor;

// export default function createSearchProcessor(callAPI) {
//   return ({ getState, dispatch }) => next => (action) => {

//   };
// }
