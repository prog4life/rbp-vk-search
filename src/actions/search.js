import {
  FETCH_WALL_POSTS_REQUEST, FETCH_WALL_POSTS_SUCCESS, FETCH_WALL_POSTS_FAIL,
  TERMINATE_SEARCH,
} from 'constants/actionTypes';
import {
  apiVersion, count, offsetModifier, requestInterval, inputDefaults,
} from 'config/common';
import { SEARCH_CONFIG } from 'middleware/searchProcessor';
import { getIdsOfPosts } from 'selectors';

// export const addResults = (results, limit, order = defaultOrder) => ({
//   type: 'ADD_RESULTS',
//   results,
//   limit,
//   order,
// });

export const requestStart = (offset, attempt = 1) => ({
  type: 'REQUEST_START',
  offset,
  startTime: Date.now(),
  attempt,
});

export const requestSuccess = offset => ({
  type: 'REQUEST_SUCCESS',
  offset,
});

export const requestFail = (offset, attempt = 1) => ({
  type: 'REQUEST_FAIL',
  offset,
  attempt,
});

export const updateSearch = (total, processed) => ({
  type: 'SEARCH_UPDATE',
  total,
  processed,
});

// export const wallPostsSearchEnd = () => ({
//   type: SEARCH_END,
// });

export const terminateSearch = () => ({
  type: TERMINATE_SEARCH,
});

export const searchTimerTick = () => ({
  type: 'SEARCH_TIMER_TICK',
});

export const setSearchIntervalId = id => ({
  type: 'SET_SEARCH_INTERVAL_ID',
  intervalId: id,
});

// NOTE: can retrieve info about author of posts at wall using wall.get with
// extended param set to 1 from additional "profiles" field, profile objects in
// addition to "user_id" field also includes first_name, last_name, sex, online,
// 2 avatar fields, so can search using corresponding queries

// will be utilized by searchProcessor middleware
export const startWallPostsSearch = (inputData) => {
  // TEMP: for testing
  const { postAuthorIdDef } = inputDefaults;

  const { wallOwnerType, wallOwnerShortName = '' } = inputData;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const wallOwnerId = inputData.wallOwnerId || '';
  const postAuthorId = Number(inputData.postAuthorId) || postAuthorIdDef;
  const searchResultsLimit = Number(inputData.searchResultsLimit) || undefined;

  // TODO: use encodeURIComponent ?
  const baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
    `&domain=${wallOwnerShortName}` +
    // TODO: make next 2 optional
    `&count=${count}&v=${apiVersion}&extended=0`;

  return {
    types: [
      // SEARCH_START,
      FETCH_WALL_POSTS_REQUEST,
      FETCH_WALL_POSTS_SUCCESS,
      FETCH_WALL_POSTS_FAIL,
      // 'REQUEST_START',
      // 'REQUEST_SUCCESS',
      // 'REQUEST_FAIL',
      'SEARCH_UPDATE',
      // SEARCH_END,
    ],
    // TODO:
    // getEndpoint() or getToken() instead of endpoint
    getNumberOfResults: state => getIdsOfPosts(state).length,
    [SEARCH_CONFIG]: {
      searchResultsLimit,
      authorId: postAuthorId,
      baseAPIReqUrl,
      // TODO: schema: 'wall-posts',
      // next 2 is optional, defaults must be passed to middleware factory
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
    },
  };
};

// export const startWallPostsSearch = (inputData, interval = requestInterval) => (
//   (dispatch) => {
//     const intId = setInterval(() => dispatch(searchTimerTick()), interval);
//     dispatch(setSearchIntervalId(intId));
//     dispatch(initializeWallPostsSearch(inputData));
//   }
// );

// export const startWallPostsSearch = (inputData) => {
//   // TEMP:
//   const { postAuthorIdDef, ownerIdDef } = inputDefaults;

//   const { wallOwnerType, wallOwnerShortName } = inputData;
//   const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
//   const wallOwnerId = inputData.wallOwnerId || ownerIdDef;
//   const postAuthorId = Number(inputData.postAuthorId) || postAuthorIdDef;
//   const searchResultsLimit = Number(inputData.searchResultsLimit);

//   // TODO: add "&access_token=${accessToken}" here ?
//   // TODO: use encodeURIComponent ?
//   const baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
//     `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
//     `&domain=${wallOwnerShortName}` +
//     `&count=${count}&v=${apiVersion}&extended=0`;

//   return {
//     type: SEARCH_START,
//     searchConfig: {
//       // replaced by in place "transformResponse" call below
//       // authorId: postAuthorId,
//       baseAPIReqUrl,
//       searchResultsLimit,
//       offsetModifier, // should be equal to request url "count" param value
//       requestInterval,
//     },
//     // callAPI: fetchJSONP,
//     callAPI: fetchJSONP,
//     handleResponse: transformResponse(postAuthorId),
//     addResults,
//     requestStart,
//     requestSuccess,
//     requestFail,
//     updateSearch,
//     completeSearch: wallPostsSearchEnd
//   };
// };
