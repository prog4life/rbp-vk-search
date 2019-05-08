import {
  SET_POSTS_SORT_ORDER, SET_POSTS_FILTER_TEXT,
  START_WALL_POSTS_SEARCH, POSTS_RECEIVED,
} from 'constants/actionTypes';
// import { WALL_POSTS_BY_SEX, WALL_POSTS_BY_AUTHOR_ID } from 'constants/searchModes';
import { WALL_GET_BASE_URL } from 'constants/api';
import { apiVersion, count } from 'config/common';
import { targets, SEARCH_PARAMETERS } from 'middleware/searchProcessor';
import { getIdsOfPosts } from 'selectors';

export const setPostsSortOrder = (order = 'descend') => ({
  type: SET_POSTS_SORT_ORDER,
  order,
});

export const setPostsFilterText = (filterText = '') => ({
  type: SET_POSTS_FILTER_TEXT,
  filterText,
});

// NOTE: can retrieve info about author of posts at wall using wall.get with
// extended param set to 1 from additional "profiles" field, profile objects
// includes: user_id, first_name, last_name, sex, online, online_mobile,
// phot_50, photo_100, deactivated: "deleted", screen_name

// NOTE: or create separate action creators: findWallPostsBySex/AuthorId
// will be utilized by searchProcessor middleware
export const startWallPostsSearch = (inputData) => { // pass accessToken here ?
  const {
    wallOwnerType, wallOwnerUsualId, wallOwnerCustomId,
    postAuthorId, postAuthorSex, resultsLimit,
  } = inputData;

  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  // TODO: validate wallOwnerId with additional preceding request to API
  const ownerId = wallOwnerUsualId
    ? `${wallOwnerTypePrefix}${wallOwnerUsualId}`
    : '';
  const domain = wallOwnerCustomId || '';
  // const baseRequestURL = `${WALL_GET_BASE_URL}?`
  //   + `${ownerId}${domain}&count=${count}&v=${apiVersion}&extended=1`;

  return {
    type: START_WALL_POSTS_SEARCH,
    resultsType: POSTS_RECEIVED,
    // state => number of searched items
    getNumberOfResults: state => getIdsOfPosts(state).length, // OR:
    [SEARCH_PARAMETERS]: {
      method: 'wall.get',
      requestParams: {
        count,
        owner_id: ownerId ? Number(ownerId) : null,
        domain,
        v: `${apiVersion}`,
        extended: 1,
      },
      target: targets.WALL_POSTS,
      filters: { postAuthorId, postAuthorSex },
      resultsLimit,
    },
  };
};

// export const startWallPostsSearch = (inputData) => { // pass accessToken here ?
//   const {
//     wallOwnerType, wallOwnerUsualId, wallOwnerCustomId,
//     postAuthorId, postAuthorSex, resultsLimit,
//   } = inputData;

//   const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
//   const ownerId = wallOwnerUsualId
//     ? `owner_id=${wallOwnerTypePrefix}${wallOwnerUsualId}`
//     : '';
//   const domain = wallOwnerCustomId ? `&domain=${wallOwnerCustomId}` : '';

//   // TODO: use encodeURIComponent ?

//   // TODO: get value of count from offsetModifier and apply it internally        !!!

//   // with extended=1 can also set specific fields to be returned by API
//   const baseRequestURL = `${WALL_GET_BASE_URL}?`
//     + `${ownerId}${domain}&count=${count}&v=${apiVersion}&extended=1`;

//   return {
//     types: [
//       // SEARCH_START, FETCH_WALL_POSTS_REQUEST, FETCH_WALL_POSTS_FAIL,
//       POSTS_RECEIVED,
//     ],
//     // TODO: getEndpoint() or getToken() instead of endpoint
//     // state => number of searched items
//     getNumberOfResults: state => getIdsOfPosts(state).length, // OR:
//     // IDEA:
//     // pass searchTarget/itemsName/searchedItems ('WallPosts' || 'WALL_POSTS')
//     [SEARCH_PARAMETERS]: {
//       baseRequestURL,
//       // mode: postAuthorId ? WALL_POSTS_BY_AUTHOR_ID : WALL_POSTS_BY_SEX,
//       target: targets.WALL_POSTS,
//       filters: { postAuthorId, postAuthorSex },
//       resultsLimit,
//     },
//   };
// };

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
//   const resultsLimit = Number(inputData.resultsLimit);

//   // TODO: add "&access_token=${accessToken}" here ?
//   // TODO: use encodeURIComponent ?
//   const baseRequestURL = 'https://api.vk.com/method/wall.get?' +
//     `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
//     `&domain=${wallOwnerCustomId}` +
//     `&count=${count}&v=${apiVersion}&extended=0`;

//   return {
//     type: SEARCH_START,
//     searchParams: {
//       // replaced by in place "transformResponse" call below
//       // authorId: postAuthorId,
//       baseRequestURL,
//       resultsLimit,
//       offsetModifier, // should be equal to request url "count" param value
//       requestInterval,
//     },
//     // callAPI: fetchJSONP,
//     callAPI: fetchJSONP,
//     transformResponse: transformResponse(postAuthorId),
//     addResults,
//     requestStart,
//     requestSuccess,
//     requestFail,
//     updateSearch,
//     completeSearch: wallPostsSearchEnd
//   };
// };
