import axiosJSONP from 'utils/axios-jsonp';
import prepareWallPosts from 'utils/response-handling';
import {
  maxAttemptsPending as maxAttemptsPendingDefault,
  maxAttemptsFailed as maxAttemptsFailedDefault
} from 'config/common';

export const SEARCH_CONFIG = 'Search Config';

export const kindsOfData = {
  wallPosts: 'WALL_POSTS'
  // wallComments: 'WALL_COMMENTS'
};

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: rename to searchProcessor, extractor, e.t.c
const searchProcessor = ({ dispatch, getState }) => {
  const search = {
    // isActive: false,
    offset: 0
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
  //     attempt: 0
  //     startTime: Number // Date.now() value
  //     isPending: true, // failed request will get "false" value here
  //     isDone: false
  //   }
  // };

  const onRequestStart = (offset, attempt) => {
    const key = `offset_${offset}`;

    requests[key] = {
      id: key,
      offset,
      startTime: Date.now(),
      attempt,
      isPending: true,
      isDone: false
    };
  };

  // remove successful request obj from "requests"
  const onRequestSuccess = (getState, offset) => (response) => {
    const { search: searchState } = getState();
    // const { search } = getState();
    console.log('success searchState: ', searchState);
    if (searchState.isActive) {
      const key = `offset_${offset}`;

      delete requests[key];
      // add searchState for chained further onSearchProgress handler
      return { response, searchState };
    }
    throw Error(`Unnecessary response ${offset}, search is terminated already`);
  };

  // add failed request obj with isPending: false to "requests"
  const onRequestFail = (getState, offset, attempt) => (e) => {
    const { isActive } = getState().search;
    console.log('fail isActive: ', isActive);
    if (isActive) {
      const key = `offset_${offset}`;
      // TODO: cannot read property startTime of undefined                       !!!
      const { startTime } = requests[key]; // TODO: replace with object spread

      requests[key] = {
        id: key,
        offset,
        startTime,
        attempt,
        isPending: false,
        isDone: false
      };

      throw Error(`Request with ${offset} offset FAILED, ${e.message}`);
    }
    throw Error(`Unnecessary response ${offset}, search is terminated already`);
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
        // to get updated "total"
        const resCount = response && response.count ? response.count : total;

        let updated = offsets.some(o => o === offset)
          ? processed
          : offsets.push(offset) * offsetModifier;

        // to get correct value of processed items (not bigger than total)
        // at the end of search
        updated = updated > resCount
          ? resCount
          : updated;

        if (resCount !== total || updated !== processed) {
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
      maxAttemptsFailed = maxAttemptsFailedDefault
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

    const makeCallToAPI = (offset = 0, attempt = 1) => {
      // add request obj with isPending: true to "requests"
      onRequestStart(offset, attempt);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${offset}`;

      // NOTE: in all next chain must be used offset value that was actual
      // at interval tick moment, i.e. passed to "makeCallToAPI"
      axiosJSONP(currentAPIReqUrl)
        .then(
          // TODO: maybe it will be rational to get attempt value from
          //  existing request with same key
          onRequestSuccess(getState, offset),
          onRequestFail(getState, offset, attempt)
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
// TODO: remove failed and pending which attempt values have exceeded max limit
// OR simply skip them on exit condition, clirify why 500 offset with 
// attempt: 2 and both states as false was not removed                           !!!
    scannerIntervalId = setInterval(() => {
      const { offset } = search;
      let nextOffset;

      // TODO: think over search.isActive check

      const reqs = Object.values(requests);

      if (reqs.length > 0) {
        console.log('REQUESTS 4: ', JSON.stringify(reqs, null, 2));

        // const expired = reqs.find(request => (
        //   request.isPending && Date.now() - request.startTime > waitTimeout
        //   && expired.attempt < maxAttemptsPending
        // ));
        const expired = reqs.find((req) => {
          const difference = Date.now() - req.startTime;

          if (req.isPending
            && difference > waitTimeout
            && req.attempt < maxAttemptsPending) {
            console.warn(`PENDING attempt ${req.attempt} REQ DIFFERENCE: ${difference}`);
            return true;
          }
          return false;
        });
        console.warn('EXPIRED: ', JSON.stringify(expired, null, 2));

        if (expired) {
          // cancel and repeat
          console.log('WILL REPEAT with attempt: ', expired.attempt + 1);
          makeCallToAPI(expired.offset, expired.attempt + 1);
          return;
        }

        const pendingReq = reqs.some(request => request.isPending);

        if (pendingReq && waitPending) {
          return;
        }

        const failedReq = reqs.find(req => (
          !req.isPending && !req.isDone && req.attempt < maxAttemptsFailed
        ));

        // no pending requests OR "waitPending" is false and failed requests
        // present - in both cases repeat first failed request
        if ((!pendingReq || !waitPending) && failedReq) {
          console.log('Not waiting for pending and call: ', failedReq.offset);

          makeCallToAPI(failedReq.offset, failedReq.attempt + 1);
          return;
        }
        const { total: tempTotal } = getState().search;

        nextOffset = offset + offsetModifier;
        // no failed requests, "waitPending" is false,
        // all items requested but some pending requests that have not exceeded
        // waitTimeout are still present
        if (nextOffset > tempTotal) { // TODO: add !tempTotal ?
          nextOffset -= offsetModifier;
          return;
        }
      } else {
        nextOffset = offset + offsetModifier;
      }
      search.offset = nextOffset;

      const { results, search: { total } } = getState();

      if (!searchResultsLimit || results.length < searchResultsLimit) {
        // request next portion of items using increased offset OR end search
        if (!total || nextOffset <= total) {
          makeCallToAPI(nextOffset);
          return;
        }
      }

      if (reqs.length === 0) { // OR req.every(req => )
        // search.isActive = false;
        clearInterval(scannerIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // to make first request before timer tick, return was added for eslint
    return makeCallToAPI(search.offset);
  };
};

export default searchProcessor;
