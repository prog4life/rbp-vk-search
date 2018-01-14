import { apiVersion, count, requestInterval, inputDefaults } from 'config/api';
import fetchWallDataJSONP from 'actions/fetch';
import { parseWallPosts } from 'actions/results';

// let wallPostsSearchIntervalId = null;
// let emptyResponses = 0;
// let totalPostsAtWall = 5000; // NOTE: temporarily
// let baseAPIReqUrl = '';
// let offset = 0;
// let authorId;
// let postsAmount;
// let searchStart;

// export function prepareUserSearch(inputValues) {
//   IDEA: handle user input, create api request params and place them to store
// }

export function finishSearch(
  intervalId = wallPostsSearchIntervalId,
  searchStopType = 'FINISH_SEARCH'
) {
  clearInterval(intervalId);
  return {
    type: searchStopType
  };
}

export const stopSearch = (searchStopType = 'STOP_SEARCH') => ({
  type: searchStopType,
  stopSearch: finishSearch
});

// export const getPartOfResults = currentOffset => dispatch => (
//   dispatch(fetchWallDataJSONP(
//     `${baseAPIReqUrl}&offset=${currentOffset}`,
//     currentOffset
//   ))
//     .then((response) => {
//       // totalPostsAtWall = response.count && response.count < totalPostsDef
//       //   ? response.count
//       //   : totalPostsDef;
//       // TODO: remove totalPostsDef completely
//       // return response;
//       dispatch(parseWallPosts(response, authorId, postsAmount));
//     } /* TODO: catch failed request and store it in [] */)
//     .catch(e => console.warn('To catch uncaught ', e))
//
//     // .then(response => extractUserPosts(response, authorId))
//     // .then(posts => formatWallPosts(posts))
//     // .then((results) => {
//     //   if (results.length > 0) {
//     //     // dispatch(addResults(results));
//     //     dispatch({
//     //       type: 'ADD_SORT_CUT_RESULTS',
//     //       results,
//     //       ascending: false,
//     //       amount: postsAmount
//     //     });
//     //     dispatch({ type: 'RESULTS_HAVE_BEEN_HANDLED' });
//     //     console.log('duration: ', Date.now() - searchStart);
//     //     console.log('resultsChunk: ', results);
//     //   }
//     // })
//     // .catch(e => console.error(e))
// );

export const searchPostsAtWall = (inputValues) => {
  // TEMP
  const {
    postsAmountDef, authorIdDef, ownerIdDef, ownerDomainDef
  } = inputDefaults;

  const { searchQuery, wallOwnerType } = inputValues;
  const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
  const wallOwnerId = inputValues.wallOwnerId || ownerIdDef;
  const wallOwnerDomain = inputValues.wallOwnerDomain || ownerDomainDef;
  const authorId = Number(inputValues.authorId) || authorIdDef;
  const postsAmount = Number(inputValues.postsAmount) || postsAmountDef;
  // NOTE: cut "&access_token=${accessToken}"
  // TODO: use "searchQuery" and "postsAmount" ?
  const baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerTypePrefix}${wallOwnerId}` +
    `&domain=${wallOwnerDomain}` +
    `&count=${count}&v=${apiVersion}&extended=1`;

  return {
    type: 'WALL_POSTS_SEARCH_START',
    scanConfig: {
      authorId,
      baseAPIReqUrl,
      postsAmount,
      requestInterval,
      searchQuery
    },
    // TODO: clear results from within it
    startSearch: () => dispatch => (dispatch({ type: 'CLEAR_RESULTS' })),
    callAPI: fetchWallDataJSONP,
    handleResponse: parseWallPosts,
    // completeSearch: finishSearch
    completeSearch: () => dispatch => (
      dispatch(finishSearch(null, 'WALL_POSTS_SEARCH_END'))
    )
  };
};

/* eslint-disable max-statements */
// export const searchPostsOnWall = inputValues => (dispatch, getState) => {
//   // let offset = 0;
//   // let totalPostsAtWall;
//   const { accessToken } = getState();
//   const {
//     postsAmountDef, authorIdDef, ownerIdDef, ownerDomainDef
//   } = inputDefaults;
//   const { searchQuery, wallOwnerType } = inputValues;
//   const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
//   const wallOwnerId = inputValues.wallOwnerId || ownerIdDef;
//   const wallOwnerDomain = inputValues.wallOwnerDomain || ownerDomainDef;
//   authorId = Number(inputValues.authorId) || authorIdDef;
//   postsAmount = Number(inputValues.postsAmount) || postsAmountDef;
//   baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
//     `owner_id=${wallOwnerTypePrefix}${wallOwnerId}&domain=${wallOwnerDomain}` +
//     `&count=${count}&access_token=${accessToken}&v=${apiVersion}&extended=1`;
//   searchStart = Date.now();
//
//   // NOTE: doublecheck
//   clearInterval(wallPostsSearchIntervalId);
//   // TODO: reset offset at new search
//   offset = 0;
//   dispatch({ type: 'CLEAR_RESULTS' });
//
//   wallPostsSearchIntervalId = setInterval(() => {
//     const { results, failedRequests } = getState();
//     // NOTE: temporarily done by single action
//     // dispatch(sortResults(false));
//     // dispatch(cutExcessResults(postsAmount));
//     if (results.length < postsAmount) {
//       if (!totalPostsAtWall || offset < totalPostsAtWall) {
//         // NOTE: must depend on count var
//         offset += 100;
//         return dispatch(getPartOfResults(offset));
//       }
//     }
//
//     // TODO: handle case with wrong wall owner id
//
//     // TODO: add and check pending requests state                                !!!
//     if (failedRequests.length > 0) {
//       const req = failedRequests.find(failedReq => !failedReq.pending);
//       if (req) {
//         dispatch(getPartOfResults(req.offset));
//       }
//       return false;
//     }
//     return dispatch(finishSearch(wallPostsSearchIntervalId));
//
//     // NOTE: maybe add exit condition when get empty items(posts) few times
//     // if (responseData.items.length = 0) { ... }
//   }, requestInterval);
//   dispatch({ type: 'START_SEARCH' });
//   dispatch(getPartOfResults(offset));
// };
