// let wallPostsSearchIntervalId = null;
// let emptyResponses = 0;
// let totalNumerOfPosts = 5000; // NOTE: temporarily
// let baseAPIReqUrl = '';
// let offset = 0;
// let postAuthorId;
// let searchResultsLimit;
// let searchStart;

// export function prepareUserSearch(inputData) {
//   IDEA: handle user input, create api request params and place them to store
// }

// ----------------------------------------------------------------------------
const codeParam = `
  var nextWallGetRequestOffset;
  var requestCount = 1;
  var items = API.wall.get({
    "owner_id": -101271678,
    "offset": 0,
    "count": 100
  }).items;
  // items = [
  // { id: 5324, ..., comments: { count: 5 }, ...},
  // { id: 4384, ..., comments: { count: 0 }, ...},
  // ... ]
  // var ids = items@.from_id;
  var postIds = items@.id;
  var numberOfCommentsInPost = items@.comments@.count; // [6, 18, 9, 27, 17, ...]
  var commentsResponses = [];
  var commentsCounts = [];
  var commentsLength;
  var handledPostsIds = [];
  var idOfLastHandledPost;
  var idOfNextPostToHandle;
  var nextGetCommentsRequestOffset;

  var i = 0;
  while (i < numberOfCommentsInPost.length) {
    if (numberOfCommentsInPost[i] > 0 && requestCount < 25) {
      var postId;

      if (idOfNextPostToHandle) {
        postId = idOfNextPostToHandle;
        idOfLastHandledPost = postId;
      } else {
        postId = items@.id[i];
        idOfLastHandledPost = postId;
      }
      handledPostsIds.push(postId);

      var commentsChunk = API.wall.getComments({
        "owner_id": -101271678,
        "post_id": postId,
        // "offset": 0,
        // start_comment_id: 4242,
        "count": 100,
        "sort": "desc",
        "preview_length": 0,
        // 0 - do not cut comment text
        "extended": 0
      });
      requestCount = requestCount + 1;

      // if (commentsChunk.items) {             add or not ???
      idOfNextPostToHandle = items@.id[i + 1];
      // }

      commentsResponses.push(commentsChunk);
      commentsCounts.push(commentsChunk.count);
    }

    // if (items[i].comments.count > 0) {
    //   postsWithCommentsIds.push(items[i].id);
    // }
    i = i + 1;
  }
  commentsLength = commentsResponses.length;

  return {
    "counts": commentsCounts,
    "commentsLength": commentsLength,
    "idOfLastHandledPost": idOfLastHandledPost,
    "idOfNextPostToHandle": idOfNextPostToHandle,
    "handledPostsIds": handledPostsIds,
    "postIds": postIds,
    "comments ": commentsResponses
  };
`;

// [8055, 25559, 25471, 25434, 25405, 25363, 25320, 25292, 25230, 25224, 25221,
// 25033, 24966, 24965, 24946, 24941, 24647, 24610, 24505, 24440, 24386, 24272,
// 24170, 23563]

const code2 = `
  var offset = 0;
  var postsStore = [];
  var postIdsStore = [];
  var postsCount = 0;

  var i = 0;

  while (i < 10) {                   // FROM 10 TO 25

    var posts = API.wall.get({
      "owner_id": -11026685,
      "offset": offset,
      "count": 100
    }).items;

    postsStore.push(posts);

    postsCount = postsCount + posts.length;

    var postIds = posts@.id;
    // var idsCount = postIdsStore.length;
    // postIdsStore.splice(idsCount, idsCount + postIds.length, postIds);
    postIdsStore.push(postIds);

    offset = offset + 100;

    i = i + 1;
  }

  // var id = posts@.id;
  // var fromId = posts@.from_id;
  // var dates = posts@.date;
  // var text = posts@.text;
  // var fromId = posts@.from_id;
  // var commentsCount = posts@.comments@.count;
  // var likesCount = posts@.likes@.count;

  return {
    "postsCount": postsCount,
    "ids": postIdsStore,
    // "fromId": fromId,
    // "dates": dates,
    // "text": text,
    // "commentsCount": commentsCount,
    // "likesCount": likesCount,
    "posts": postsStore
  };
`;

// ----------------------------------------------------------------------------

export const searchPostsWithExecute = (accessToken) => {
  const baseCallURL = 'https://api.vk.com/method/execute?';
  const callURL = `${baseCallURL}code=${encodeURIComponent(code2)}` +
    `&access_token=${accessToken}&v=${apiVersion}`;

  return fetchJSONP(callURL);
};

export const searchCommentsWithExecute = () => (dispatch, getState) => {
  const token = getState().accessToken;
  const baseCallURL = 'https://api.vk.com/method/execute?';
  const callURL = `${baseCallURL}code=${encodeURIComponent(code2)}` +
    `&access_token=${token}&v=${apiVersion}`;

  return fetchJSONP(callURL);
};

export const searchCommentsWithStoredProcedure = (procedure, token) => {
  const callURL = `https://api.vk.com/method/execute.${procedure}?` +
    `access_token=${token}&v=${apiVersion}`;

  return fetchJSONP(callURL);
};

// export function finishSearch(wallPostsSearchIntervalId) {
//   clearInterval(intervalId);
//   return {
//     type: 'FINISH_SEARCH'
//   };
// }

// export const getPartOfResults = currentOffset => dispatch => (
//   dispatch(fetchJSONP(
//     `${baseAPIReqUrl}&offset=${currentOffset}`,
//     currentOffset
//   ))
//     .then((response) => {
//       // totalNumerOfPosts = response.count && response.count < responseCountDef
//       //   ? response.count
//       //   : responseCountDef;
//       // TODO: remove responseCountDef completely
//       // return response;
//       dispatch(prepareWallPosts(response, postAuthorId, searchResultsLimit));
//     } /* TODO: catch failed request and store it in [] */)
//     .catch(e => console.warn('To catch uncaught ', e))
//
//     // .then(response => extractPostsById(response, postAuthorId))
//     // .then(posts => formatWallPosts(posts))
//     // .then((results) => {
//     //   if (results.length > 0) {
//     //     // dispatch(addResults(results));
//     //     dispatch({
//     //       type: 'ADD_SORT_CUT_RESULTS',
//     //       results,
//     //       ascending: false,
//     //       amount: searchResultsLimit
//     //     });
//     //     dispatch({ type: 'RESULTS_HAVE_BEEN_HANDLED' });
//     //     console.log('duration: ', Date.now() - searchStart);
//     //     console.log('resultsChunk: ', results);
//     //   }
//     // })
//     // .catch(e => console.error(e))
// );

/* eslint-disable max-statements */
// export const searchPostsOnWall = inputData => (dispatch, getState) => {
//   // let offset = 0;
//   // let totalNumerOfPosts;
//   const { accessToken } = getState();
//   const {
//     searchResultsLimitDef, postAuthorIdDef, ownerIdDef, ownerDomainDef
//   } = inputDefaults;
//   const { wallOwnerType } = inputData;
//   const wallOwnerTypePrefix = wallOwnerType === 'user' ? '' : '-';
//   const wallOwnerId = inputData.wallOwnerId || ownerIdDef;
//   const wallOwnerShortName = inputData.wallOwnerShortName || ownerDomainDef;
//   postAuthorId = Number(inputData.postAuthorId) || postAuthorIdDef;
//   searchResultsLimit = Number(inputData.searchResultsLimit) || searchResultsLimitDef;
//   baseAPIReqUrl = 'https://api.vk.com/method/wall.get?' +
//     `owner_id=${wallOwnerTypePrefix}${wallOwnerId}&domain=${wallOwnerShortName}` +
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
//     // dispatch(cutExcessResults(searchResultsLimit));
//     if (results.length < searchResultsLimit) {
//       if (!totalNumerOfPosts || offset < totalNumerOfPosts) {
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
