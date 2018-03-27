import { maxAttempts as maxAttemptsDefault } from 'config/common';
import { CALL_API } from 'middleware/callAPI';

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
  //     attempt: 1, // how many times request was sent/sent again
  //     startTime: integer // Date.now() value
  //     isPending: true, // failed request will get "false" value here
  //   }
  // };

  return next => (action) => {
    const { auth: { accessToken } } = getState();
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
      throw new Error('Expected an array of four action types.');
    }
    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object of search config params');
    }
    if (!types.every(t => typeof t === 'string')) {
      throw new Error('Expected action types to be strings');
    }
    if (typeof accessToken !== 'string' || !accessToken.length) {
      throw new Error('Expected access token to be not empty string');
    }

    const [
      searchStartType,
      addResultsType,
      updateProgressType, // TODO: make it interval const
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
      maxAttempts = maxAttemptsDefault,
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(scannerIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });

    // let checkpoint = performance.now(); // TEMP:
    // let checkpoint2 = performance.now(); // TEMP:

    const makeCallToAPI = (offset, attempt = 1) => {
      // const tempCheckpoint2 = checkpoint2;
      // checkpoint2 = performance.now();
      // console.warn(`NEW REQUEST with ${offset} offset, attempt: ` +
      //   `${attempt}, interval: ${checkpoint2 - tempCheckpoint2} and shift: ${performance.now() - checkpoint}`);
      // add request obj with isPending: true to "requests"
      // onRequestStart(next, offset, attempt);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${offset}`;

      dispatch({
        types: [addResultsType, updateProgressType],
        [CALL_API]: {
          url: currentAPIReqUrl,
          offset,
          attempt,
          authorId,
          resultsLimit: searchResultsLimit,
        },
      });
    };

    scannerIntervalId = setInterval(() => {
      // const tempCheckpoint = checkpoint;
      // checkpoint = performance.now();
      // console.warn(`NEW interval TICK: ${checkpoint - tempCheckpoint}`);

      const { results, requests, search: { offset, total } } = getState();
      const reqs = Object.values(requests);
      let nextOffset;
      let completelyFailed = 0;

      // TODO: think over search.isActive check
      if (reqs.length > 0) {
        // console.log('REQUESTS LEFT: ', JSON.stringify(reqs, null, 2));

        const failedReq = reqs.find(req => (
          !req.isPending && req.attempt < maxAttempts
        ));
        // repeat first failed request
        if (failedReq) {
          console.log(`Repeat FAILED with ${failedReq.offset} ` +
            `offset and attempt ${failedReq.attempt + 1} `);

          makeCallToAPI(failedReq.offset, failedReq.attempt + 1);
          return;
        }
        nextOffset = offset + offsetModifier;

        if (nextOffset > total) { // TODO: add !total ?
          // NOTE: or just not add such requests to "requests" on start
          // OR just count them and do: reqs.length - completelyFailed.length === 0
          // failed requests that have exceeded max attempt limit
          completelyFailed = reqs.filter(req => (
            !req.isPending && req.attempt >= maxAttempts
          ));
          console.warn('completelyFailed: ', completelyFailed);
          console.info('reqs after completelyFailed were counted: ', reqs);
          // some pending requests are still present - repeat check on next
          // timer tick
          if (reqs.length > completelyFailed) {
            nextOffset -= offsetModifier;
            return;
          }
        }
      } else {
        nextOffset = offset + offsetModifier;
      }
      next({ type: 'SET_OFFSET', offset: nextOffset });

      if (!searchResultsLimit || results.length < searchResultsLimit) {
        // request next portion of items using increased offset
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
