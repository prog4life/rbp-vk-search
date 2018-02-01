import {
  apiVersion, count, extended, requestInterval, inputDefaults
} from 'config/common';
import fetchDataJSONP from 'utils/fetch';
import parsePostsFromWall from 'utils/responseHandling';

export const addResults = results => ({
  type: 'ADD_RESULTS',
  results
});

export function endUpSearch(results, searchStopType = 'FINISH_SEARCH') {
  return {
    type: searchStopType,
    results
  };
}

// TODO: skip handling of pending requests results after search stop
export const terminateSearch = results => ({
  type: 'TERMINATE_SEARCH',
  results
});

// NOTE: can retrieve info about author of posts at wall using wall.get with
// extended param set to 1 from additional "profiles" field, profile objects in
// addition to "user_id" field also includes first_name, last_name, sex, online,
// 2 avatar fields, so can search using corresponding queries

// TODO: rename "wallOwnerDomain" to "wallOwnerScreenName" or "ShortName"

export const searchPostsAtWall = (inputData) => {
  // TEMP
  const {
    postsLimitDef, authorIdDef, ownerIdDef, ownerDomainDef
  } = inputDefaults;

  const { wallOwnerType } = inputData;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const wallOwnerId = inputData.wallOwnerId || ownerIdDef;
  const wallOwnerDomain = inputData.wallOwnerDomain || ownerDomainDef;
  const authorId = Number(inputData.authorId) || authorIdDef;
  const postsLimit = Number(inputData.postsLimit) || postsLimitDef;
  // TODO: add "&access_token=${accessToken}" here ?
  // TODO: use encodeURIComponent ?
  const baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
    `&domain=${wallOwnerDomain}` +
    `&count=${count}&v=${apiVersion}&extended=${extended}`;

  return {
    type: 'WALL_POSTS_SEARCH_START',
    searchConfig: {
      authorId,
      baseAPIReqUrl,
      postsLimit,
      requestInterval
    },
    callAPI: fetchDataJSONP,
    parseResponse: parsePostsFromWall,
    addResultsType: 'ADD_RESULTS',
    completeSearch: results => dispatch => (
      dispatch(endUpSearch(results, 'WALL_POSTS_SEARCH_END'))
    )
  };
};
