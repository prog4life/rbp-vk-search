import fetchJsonp from 'fetch-jsonp';
import {apiVersion, requestInterval} from '../api/initial';

let userPostsSearchIntervalId = null;

// export function prepareUserSearch(inputValues) {
//   handle user input, create api request params and place them to store  
// }

/* eslint-disable max-statements */
export const searchUserPosts = (inputValues) => (dispatch, getState) => {
  console.log(inputValues);
  let offset = 0;
  let totalPosts = 5000;
  let searchDuration = 0;
  const searchStart = performance.now();
  const {token} = getState().tokenData;
  // TODO: make postsAmount default value to be one of app config params
  const authorId = Number(inputValues.authorId);
  const postsAmount = inputValues.postsAmount || 100;
  const {wallOwner, wallDomain, searchQuery} = inputValues;
  const baseApiReqUrl = `https://api.vk.com/method/wall.get?` +
    `owner_id=${wallOwner}&domain=${wallDomain}&count=100` +
    `&access_token=${token}` +
    `&v=${apiVersion}` +
    `&extended=1`;

  // NOTE: for situation when user press "Stop" button
  clearInterval(userPostsSearchIntervalId);

  const handleRequestInterval = () => {
    // TODO: it makes requests with same offset, RESOLVE                       !!!
    // TODO: increase offset only if response.ok, count attempts here
    offset += 100;

    dispatch(fetchWallPosts(baseApiReqUrl, offset))
    .then((posts) => {
      return parseUserPosts(posts, authorId);
    })
    .then((userPostsChunk) => {
      return formatUserPosts(userPostsChunk);
    })
    .then((results) => {
      dispatch(addResults(results));
    })
    .catch((e) => console.error(e));
  };

  userPostsSearchIntervalId = setInterval(() => {
    if (getState().results.length >= postsAmount || offset >= totalPosts) {
      searchDuration = performance.now() - searchStart;
      dispatch({ type: 'SEARCH_USER_POSTS_END', searchDuration});
      return clearInterval(userPostsSearchIntervalId);
    }
    handleRequestInterval();
  }, requestInterval);
  handleRequestInterval();
};

export const fetchWallPosts = (baseApiReqUrl, offset) => (dispatch) => {
  const currentApiReqUrl = `${baseApiReqUrl}&offset=${offset}`;

  // console.log('api request url: ', currentApiReqUrl);
  // dispatch({ type: 'FETCH_WALL_POSTS_REQUEST', offset });

  // TODO: add "performUserPostsRequst" thunk:
  return fetchJsonp(currentApiReqUrl, {
    // to set custom callback param name (default - callback):
    // jsonpCallback: 'custom_callback',
    // to specify custom function name that will be used as callback,
    // (default - jsonp_some-number):
    // jsonpCallbackFunction: 'function_name_of_jsonp_response',
    // timeout: 3000 // default - 5000
  })
  .then((response) => (
    response.json()
  ))
  .then((resJSON) => {
    const {items: posts, count} = resJSON.response;

    dispatch({ type: 'FETCH_WALL_POSTS_SUCCESS', offset });
    return posts;
  })
  .catch((ex) => {
    console.warn('Parsing failed ', ex);
    dispatch({ type: 'FETCH_WALL_POSTS_FAIL', error: ex, offset });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dispatch(fetchWallPosts(baseApiReqUrl, offset)));
      }, requestInterval);
    });
    // throw ex;
  });

  // TODO: add stop condition when no more data
  // if (responseData.items.length = 0) {
  //   requestParams.totalPosts = 0:
  // }
  // searchResults.length = 10; // FIXME: cut excess results
};

export function parseUserPosts(posts, authorId) {
  const userPostsChunk = posts.filter((post) => {
    return post.from_id === authorId;
  });

  // if (userPostsChunk.length > 0) {
  //   return userPostsChunk;
  // }
  console.log('userPostsChunk ', userPostsChunk);
  return userPostsChunk;
}

export function formatUserPosts(posts) {
  return posts.map((post) => ({
    fromId: post.from_id,
    timestamp: post.date * 1000,
    postId: post.id,
    text: post.text,
    // TODO: add post id from result
    link: `https://vk.com/wall${post.owner_id}_${post.id}`
  }));
}

export function addResults(results) {
  return {
    type: 'ADD_RESULTS',
    results
  };
}
