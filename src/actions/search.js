import fetchJSONP from 'utils/fetchJSONP';
import axiosJSONP from 'utils/axiosJSONP';
import prepareWallPosts from 'utils/responseHandling';
import {
  apiVersion,
  count,
  offsetModifier,
  requestInterval,
  waitPending,
  waitTimeout,
  resultsSortOrder as defaultOrder,
  inputDefaults,
} from 'config/common';
import { SEARCH_CONFIG } from 'middleware/searchProcessor';

export const addResults = (results, limit, order = defaultOrder) => ({
  type: 'ADD_RESULTS',
  results,
  limit,
  order,
});

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

export const wallPostsSearchEnd = () => ({
  type: 'WALL_POSTS_SEARCH_END',
});

export const terminateSearch = () => ({
  type: 'TERMINATE_SEARCH',
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
  // TEMP:
  const { postAuthorIdDef, ownerIdDef } = inputDefaults;

  const { wallOwnerType, wallOwnerShortName } = inputData;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const wallOwnerId = inputData.wallOwnerId || ownerIdDef;
  const postAuthorId = Number(inputData.postAuthorId) || postAuthorIdDef;
  const searchResultsLimit = Number(inputData.searchResultsLimit) || undefined;

  // TODO: add "&access_token=${accessToken}" here ?
  // TODO: use encodeURIComponent ?
  const baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
    `&domain=${wallOwnerShortName}` +
    `&count=${count}&v=${apiVersion}&extended=0`;

  return {
    types: [
      'WALL_POSTS_SEARCH_START',
      // 'REQUEST_START',
      // 'REQUEST_SUCCESS',
      // 'REQUEST_FAIL',
      'ADD_RESULTS',
      'SEARCH_UPDATE',
      'WALL_POSTS_SEARCH_END'
    ],
    [SEARCH_CONFIG]: {
      authorId: postAuthorId,
      baseAPIReqUrl,
      searchResultsLimit,
      offsetModifier, // should be equal to request url "count" param value
      requestInterval,
      waitPending,
      waitTimeout,
    }
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
//     type: 'WALL_POSTS_SEARCH_START',
//     searchConfig: {
//       // replaced by in place "prepareWallPosts" call below
//       // authorId: postAuthorId,
//       baseAPIReqUrl,
//       searchResultsLimit,
//       offsetModifier, // should be equal to request url "count" param value
//       requestInterval,
//       waitPending,
//       waitTimeout
//     },
//     // callAPI: fetchJSONP,
//     callAPI: axiosJSONP,
//     handleResponse: prepareWallPosts(postAuthorId),
//     addResults,
//     requestStart,
//     requestSuccess,
//     requestFail,
//     updateSearch,
//     completeSearch: wallPostsSearchEnd
//   };
// };
