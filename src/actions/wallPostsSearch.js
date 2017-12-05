import { apiVersion, requestInterval, inputDefaults } from 'config/api';
import fetchWallDataJSONP from 'actions/fetchingWallData';
import {
  extractUserWallPosts, formatWallPosts
} from 'actions/wallPostsResults';

let wallPostsSearchIntervalId = null;
let emptyResponses = 0;
let totalPostsAtWall = 5000; // NOTE: temporarily
let baseAPIReqUrl = '';
let offset = 0;
let authorId;
let postsAmount;
let searchStart;

// export function prepareUserSearch(inputValues) {
//   IDEA: handle user input, create api request params and place them to store
// }

export function finishSearch() {
  clearInterval(wallPostsSearchIntervalId);
  return {
    type: 'FINISH_SEARCH'
  };
}

// TODO: extract as separate thunk
export const getPartOfResults = currentOffset => dispatch => (
  dispatch(fetchWallDataJSONP(baseAPIReqUrl, currentOffset))
    .then((response) => {
      // totalPostsAtWall = response.count && response.count < totalPostsDef
      //   ? response.count
      //   : totalPostsDef;
      // TODO: remove totalPostsDef completely
      return response;
    })
    .then(response => extractUserWallPosts(response, authorId))
    .then(posts => formatWallPosts(posts))
    .then((results) => {
      if (results.length > 0) {
        // dispatch(addResults(results));
        dispatch({
          type: 'ADD_SORT_CUT_RESULTS',
          results,
          ascending: false,
          amount: postsAmount
        });
        dispatch({ type: 'RESULTS_HAVE_BEEN_HANDLED' });
        console.log('duration: ', Date.now() - searchStart);
        console.log('resultsChunk: ', results);
      }
    })
    .catch(e => console.error(e))
);

/* eslint-disable max-statements */
export const searchPostsOnWall = inputValues => (dispatch, getState) => {
  // let offset = 0;
  // let totalPostsAtWall;
  const { token } = getState().tokenData;
  const {
    postsAmountDef, authorIdDef, ownerIdDef, ownerDomainDef
  } = inputDefaults;
  const { searchQuery, wallOwnerType } = inputValues;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const wallOwnerId = inputValues.wallOwnerId || ownerIdDef;
  const wallOwnerDomain = inputValues.wallOwnerDomain || ownerDomainDef;
  authorId = Number(inputValues.authorId) || authorIdDef;
  postsAmount = Number(inputValues.postsAmount) || postsAmountDef;
  baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerTypePrefix}${wallOwnerId}&domain=${wallOwnerDomain}` +
    `&count=100&access_token=${token}&v=${apiVersion}&extended=1`;
  searchStart = Date.now();

  // NOTE: doublecheck
  clearInterval(wallPostsSearchIntervalId);
  // TODO: reset offset at new search
  offset = 0;
  dispatch({ type: 'CLEAR_RESULTS' });

  wallPostsSearchIntervalId = setInterval(() => {
    const { results, failedRequests } = getState();
    // NOTE: temporarily done by single action
    // dispatch(sortResults(false));
    // dispatch(cutExcessResults(postsAmount));
    if (results.length < postsAmount) {
      if (!totalPostsAtWall || offset < totalPostsAtWall) {
        offset += 100;
        return dispatch(getPartOfResults(offset));
      }
    }

    // TODO: handle case with wrong wall owner id

    // TODO: add and check pending requests state                                !!!
    if (failedRequests.length > 0) {
      const req = failedRequests.find(failedReq => !failedReq.pending);
      if (req) {
        dispatch(getPartOfResults(req.offset));
      }
      return;
    }
    return dispatch(finishSearch());

    // NOTE: maybe add exit condition when get empty items(posts) few times
    // if (responseData.items.length = 0) { ... }
  }, requestInterval);
  dispatch({ type: 'START_SEARCH' });
  dispatch(getPartOfResults(offset));
};
