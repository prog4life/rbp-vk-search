// TODO: replace next dependency to configureStore
import { maxAttempts as maxAttemptsDefault } from 'config/common';
// TODO: pass with action
import { CALL_API } from 'middleware/callAPI';

export const SEARCH_CONFIG = 'SEARCH::Config'; // TODO: rename to search parameters
export const SEARCH_SET_OFFSET = 'SEARCH::Set-Offset';

// IDEA
export const kindsOfData = {
  wallPosts: 'WALL_POSTS',
  // wallComments: 'WALL_COMMENTS'
};

// const determineNextActionOnIntervalTick = () => {}; // TODO:

// TODO: not repeat pending, just make them failed instead; Belated Overdue
// const checkAndRepeatFailed = () => {}

const searchProcessor = ({ dispatch, getState }) => {
  let searchIntervalId;
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

    if (typeof searchConfig === 'undefined' && type !== 'TERMINATE_SEARCH') {
      return next(action);
    }
    if (!types && type !== 'TERMINATE_SEARCH') {
      return next(action);
    }
    if (type === 'TERMINATE_SEARCH') {
      clearInterval(searchIntervalId);
      return next(action);
    }

    if (!Array.isArray(types) || types.length !== 4) {
      throw new Error('Expected an array of four action types.');
    }
    if (typeof searchConfig !== 'object') {
      throw new Error('Expected an object with search config params');
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
      // TODO: retrieve defaults of next 3 from options passed to middleware factory
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      maxAttempts = maxAttemptsDefault,
    } = searchConfig;

    // TODO: validate authorId, baseAPIReqUrl

    // doublecheck
    clearInterval(searchIntervalId);
    // to notify reducers about search start
    // will also clear "requests" in store
    next({ type: searchStartType });

    // let checkpoint = performance.now(); // TEMP:
    // let checkpoint2 = performance.now(); // TEMP:

    // TODO: replace to top level
    const makeCallToAPI = (offset = 0, attempt = 1) => {
      // const tempCheckpoint2 = checkpoint2;
      // checkpoint2 = performance.now();
      // console.warn(`NEW REQUEST with ${offset} offset, attempt: ` +
      //   `${attempt}, interval: ${checkpoint2 - tempCheckpoint2} and
      //    shift: ${performance.now() - checkpoint}`);
      // add request obj with isPending: true to "requests"
      // onRequestStart(next, offset, attempt);

      const currentAPIReqUrl = `${baseAPIReqUrl}` +
        `&access_token=${accessToken}` +
        `&offset=${offset}`;

      dispatch({
        type: 'SEARCH::Call-API',
        endpoint: currentAPIReqUrl,
      });

      // dispatch({
      //   types: [addResultsType, updateProgressType],
      //   [CALL_API]: {
      //     url: currentAPIReqUrl,
      //     offset,
      //     // attempt,
      //     authorId,
      //     resultsLimit: searchResultsLimit,
      //   },
      // });
    };
    // first request before timer tick
    makeCallToAPI();

    searchIntervalId = setInterval(() => {
      // const tempCheckpoint = checkpoint;
      // checkpoint = performance.now();
      // console.warn(`NEW interval TICK: ${checkpoint - tempCheckpoint}`);

      // total is equivalent of "count" field in response from vk API
      const { results, search: { offset, total, requests } } = getState();
      const reqs = requests.byId;
      const failed = requests.failedIds;
      const pending = requests.pendingIds;

      // NOTE: max number of parallel requests/connections ~ 6-8 / 17
      // TODO: maxPendingCount ~ 6

      // TODO: increase attempt in reducer

      // requests that reach maxAttempts limit are considered completely failed
      // next failed requests should be sent again
      const toSendAgain = failed.filter(id => reqs[id].attempt < maxAttempts);

      // repeat first of failed requests
      if (toSendAgain.length > 0) {
        const [nextId] = toSendAgain;
        console.log(`Repeat FAILED with ${reqs[nextId].offset} ` +
          `offset and attempt ${reqs[nextId].attempt + 1} `);

        // makeCallToAPI(reqs[nextId].offset, reqs[nextId].attempt + 1);
        makeCallToAPI(reqs[nextId].offset);
        return;
      }

      const nextOffset = offset + offsetModifier;

      // request next portion of items using increased offset
      if (
        (!searchResultsLimit || results.length < searchResultsLimit) &&
        (!total || nextOffset <= total)
      ) {
        next({ type: SEARCH_SET_OFFSET, offset: nextOffset });
        makeCallToAPI(nextOffset);
        return;
      }

      // end search
      if (pending.length === 0) {
        clearInterval(searchIntervalId);
        next({ type: searchEndType });
      }
    }, requestInterval);
    // NOTE: return was added for eslint, maybe replace it with
    // next(initialAction); OR next({ type: searchStartType });
    return null;
  };
};

export default searchProcessor;
