import { POSTS_RECEIVED, TERMINATE_SEARCH } from 'constants/actionTypes';
import { WALL_POSTS_BY_SEX, WALL_POSTS_BY_AUTHOR_ID } from 'constants/searchModes';
import { WALL_GET_BASE_URL } from 'constants/api';
import { apiVersion, count, offsetModifier, requestInterval } from 'config/common';
import { SEARCH_PARAMETERS } from 'middleware/searchProcessor';
import { getIdsOfPosts } from 'selectors';

export const terminateSearch = () => ({
  type: TERMINATE_SEARCH,
});

// NOTE: can retrieve info about author of posts at wall using wall.get with
// extended param set to 1 from additional "profiles" field, profile objects in
// addition to "user_id" field also includes first_name, last_name, sex, online,
// 2 avatar fields, so can search using corresponding queries

// NOTE: or create separate action creators: findWallPostsBySex/AuthorId
// will be utilized by searchProcessor middleware
export const startWallPostsSearch = (inputData) => {
  const { wallOwnerType, wallOwnerUsualId, wallOwnerCustomId } = inputData;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const postAuthorId = Number(inputData.postAuthorId) || null;
  const postAuthorSex = Number(inputData.postAuthorSex) || null;
  const resultsLimit = Number(inputData.searchResultsLimit) || null;
  const ownerId = wallOwnerUsualId
    ? `owner_id=${wallOwnerTypePrefix}${wallOwnerUsualId}`
    : '';
  const domain = wallOwnerCustomId ? `&domain=${wallOwnerCustomId}` : '';

  // TODO: use encodeURIComponent ?

  const baseRequestURL = `${WALL_GET_BASE_URL}?` +
    `${ownerId}${domain}&count=${count}&v=${apiVersion}&extended=1`;

  return {
    types: [
      // SEARCH_START,
      // FETCH_WALL_POSTS_REQUEST,
      // POSTS_RECEIVED,
      // FETCH_WALL_POSTS_FAIL,
      // 'SEARCH_REQUEST',
      // 'SEARCH_REQUEST_SUCCESS',
      // 'SEARCH_REQUEST_FAIL',
      POSTS_RECEIVED,
      // SEARCH_END,
    ],
    // TODO: getEndpoint() or getToken() instead of endpoint
    // state => number of searched items
    getNumberOfResults: state => getIdsOfPosts(state).length, // OR:
    // IDEA:
    // pass searchTarget/itemsName/searchedItems ('WallPosts' || 'WALL_POSTS')
    [SEARCH_PARAMETERS]: {
      baseRequestURL,
      mode: postAuthorId ? WALL_POSTS_BY_AUTHOR_ID : WALL_POSTS_BY_SEX,
      filters: { postAuthorId, postAuthorSex },
      resultsLimit,
    },
    meta: {
      // NOTE: next 3 is optional, defaults should be passed to middleware factory
      offsetModifier, // must be equal to request url "count" param value !!!
      requestInterval,
      maxAttempts: 5,
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

//   const { wallOwnerType, wallOwnerCustomId } = inputData;
//   const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
//   const wallOwnerId = inputData.wallOwnerId || ownerIdDef;
//   const postAuthorId = Number(inputData.postAuthorId) || postAuthorIdDef;
//   const resultsLimit = Number(inputData.searchResultsLimit);

//   // TODO: add "&access_token=${accessToken}" here ?
//   // TODO: use encodeURIComponent ?
//   const baseRequestURL = 'https://api.vk.com/method/wall.get?' +
//     `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
//     `&domain=${wallOwnerCustomId}` +
//     `&count=${count}&v=${apiVersion}&extended=0`;

//   return {
//     type: SEARCH_START,
//     searchParams: {
//       // replaced by in place "handleResponse" call below
//       // authorId: postAuthorId,
//       baseRequestURL,
//       resultsLimit,
//       offsetModifier, // should be equal to request url "count" param value
//       requestInterval,
//     },
//     // callAPI: fetchJSONP,
//     callAPI: fetchJSONP,
//     handleResponse: handleResponse(postAuthorId),
//     addResults,
//     requestStart,
//     requestSuccess,
//     requestFail,
//     updateSearch,
//     completeSearch: wallPostsSearchEnd
//   };
// };
