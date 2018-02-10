import {
  apiVersion, count, extended, requestInterval, waitPending, inputDefaults
} from 'config/common';
import fetchJSONP from 'utils/fetch';
import axiosJSONP from 'utils/axios-jsonp';
import parsePostsFromWall from 'utils/responseHandling';

export const addResults = (results, limit = null) => ({
  type: 'ADD_RESULTS',
  results,
  // to cut results from within reducer
  limit
});

export const requestStart = offset => ({
  type: 'REQUEST_START',
  offset
});

export const requestSuccess = offset => ({
  type: 'REQUEST_SUCCESS',
  offset
});

export const requestFail = offset => ({
  type: 'REQUEST_FAIL',
  offset
});

export const updateSearchProgress = (total, processed) => ({
  type: 'UPDATE_SEARCH_PROGRESS',
  total,
  processed
});

export const wallPostsSearchEnd = () => ({
  type: 'WALL_POSTS_SEARCH_END'
});

// TODO: skip handling of pending requests results after search stop
export const terminateSearch = () => ({
  type: 'TERMINATE_SEARCH'
});

// NOTE: can retrieve info about author of posts at wall using wall.get with
// extended param set to 1 from additional "profiles" field, profile objects in
// addition to "user_id" field also includes first_name, last_name, sex, online,
// 2 avatar fields, so can search using corresponding queries

export const searchPostsAtWall = (inputData) => {
  // TEMP:
  const {
    searchResultsLimitDef, postAuthorIdDef, ownerIdDef, ownerDomainDef
  } = inputDefaults;

  const { wallOwnerType } = inputData;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const wallOwnerId = inputData.wallOwnerId || ownerIdDef;
  const wallOwnerShortName = inputData.wallOwnerShortName || ownerDomainDef;
  const postAuthorId = Number(inputData.postAuthorId) || postAuthorIdDef;
  const searchResultsLimit = Number(inputData.searchResultsLimit) || searchResultsLimitDef;

  // TODO: add "&access_token=${accessToken}" here ?
  // TODO: use encodeURIComponent ?
  const baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
    `&domain=${wallOwnerShortName}` +
    `&count=${count}&v=${apiVersion}&extended=${extended}`;

  return {
    type: 'WALL_POSTS_SEARCH_START',
    searchConfig: {
      authorId: postAuthorId, // TODO: remove after change below
      baseAPIReqUrl,
      searchResultsLimit,
      requestInterval,
      waitPending
    },
    // callAPI: fetchJSONP,
    callAPI: axiosJSONP,
    parseResponse: parsePostsFromWall, // TODO: parsePostsFromWall(postAuthorId)
    addResults,
    requestStart,
    requestSuccess,
    requestFail,
    updateSearchProgress,
    completeSearch: wallPostsSearchEnd
  };
};
