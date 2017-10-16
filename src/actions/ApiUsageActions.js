import fetchJsonp from 'fetch-jsonp';
import { apiVersion, requestInterval } from '../config/api';

let userPostsSearchIntervalId = null;

// export function prepareUserSearch(inputValues) {
//   IDEA: handle user input, create api request params and place them to store
// }

export function parseUserPosts(response, authorId) {
  const { items: posts } = response;

  return Array.isArray(posts)
    ? posts.filter(post => post.from_id === authorId)
    : Promise.reject(response); // NOTE: or throw?
}

export function formatUserPosts(posts) {
  return posts.map(post => ({
    fromId: post.from_id,
    timestamp: post.date * 1000,
    postId: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`
  }));
}

export function addResults(results) {
  return {
    type: 'ADD_RESULTS',
    results
  };
}

export function clearResults() {
  return {
    type: 'CLEAR_RESULTS'
  };
}

export const fetchWallData = (baseApiReqUrl, offset) => (dispatch, getState) => {
  const currentApiReqUrl = `${baseApiReqUrl}&offset=${offset}`;

  console.log('api request url offset: ', offset);
  // dispatch({ type: 'FETCH_WALL_DATA_REQUEST', offset });

  return fetchJsonp(currentApiReqUrl, {
    // timeout: 3000 // default - 5000
  })
    .then(response => response.json())
    .then((resJSON) => {
      // dispatch({ type: 'FETCH_WALL_DATA_SUCCESS', offset });
      return resJSON.response;
    })
    .catch((ex) => {
      console.warn('Parsing failed ', offset, ex);
      dispatch({ type: 'FETCH_WALL_DATA_FAIL', offset });

      const offsets = getState().failedRequestsOffsets;

      console.log('Failed requests offsets ', offsets);

      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(dispatch(fetchWallData(baseApiReqUrl, offset)));
      //   }, requestInterval);
      // });
      throw ex;
    });
};

/* eslint-disable max-statements */
export const searchUserPosts = inputValues => (dispatch, getState) => {
  let offset = 0;
  let totalPosts;
  const searchStart = performance.now();
  const { token } = getState().tokenData;
  const authorId = Number(inputValues.authorId);
  // TODO: make postsAmount default value to be one of app config params
  const postsAmount = inputValues.postsAmount || 100;
  const { wallOwner, wallDomain, searchQuery } = inputValues;
  const baseApiReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwner}&domain=${wallDomain}&count=100` +
    `&access_token=${token}` +
    `&v=${apiVersion}` +
    '&extended=1';

  // NOTE: for situation when user press "Start/Stop" button
  clearInterval(userPostsSearchIntervalId);
  dispatch({ type: 'CLEAR_RESULTS' });

  const handleRequest = (currentOffset) => {
    return dispatch(fetchWallData(baseApiReqUrl, currentOffset))
      .then((response) => {
        totalPosts = response.count;
        return response;
      })
      .then(response => parseUserPosts(response, authorId))
      .then(posts => formatUserPosts(posts))
      .then((results) => {
        if (results.length > 0) {
          dispatch(addResults(results));
          console.log('duration: ', performance.now() - searchStart);
          console.log('resultsChunk: ', results);
        }
      })
      .catch(e => console.error(e));
  };

  userPostsSearchIntervalId = setInterval(() => {
    if (getState().results.length >= postsAmount || offset >= totalPosts) {
      // Object.keys(getState().requests).forEach()

      dispatch({ type: 'SEARCH_USER_POSTS_END' });
      return clearInterval(userPostsSearchIntervalId);

      // TODO: add stop condition when no more data and cut excess results
      // if (responseData.items.length = 0) {
      //   requestParams.totalPosts = 0:
      // }
      // searchResults.length = 10;
    }
    offset += 100;
    handleRequest(offset);
  }, requestInterval);
  handleRequest(offset);
};
