import fetchJsonp from 'fetch-jsonp';
import {
  apiVersion, requestInterval, jsonpTimeout, postsAmountDefault
} from '../config/api';

let wallPostsSearchIntervalId = null;

// export function prepareUserSearch(inputValues) {
//   IDEA: handle user input, create api request params and place them to store
// }

export function parseSearchedPosts(response, authorId) {
  const { items: posts } = response;

  return Array.isArray(posts)
    ? posts.filter(post => post.from_id === authorId)
    : Promise.reject(response); // NOTE: or throw?
}

export function formatSearchedPosts(posts) {
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

export function sortResults(ascending) {
  return {
    type: 'SORT_RESULTS',
    ascending
  };
}

export function cutExcessResults(amount) {
  return {
    type: 'CUT_EXCESS_RESULTS',
    amount
  };
}

export const fetchWallData = (baseApiReqUrl, offset) => (dispatch, getState) => {
  const currentApiReqUrl = `${baseApiReqUrl}&offset=${offset}`;

  dispatch({ type: 'FETCH_WALL_DATA_REQUEST', offset });
  console.log('api request url offset: ', offset);

  return fetchJsonp(currentApiReqUrl, {
    timeout: jsonpTimeout // default - 5000
  })
    .then(response => response.json())
    .then((resJSON) => {
      dispatch({ type: 'FETCH_WALL_DATA_SUCCESS', offset });
      return resJSON.response;
    })
    .catch((ex) => {
      console.warn('Parsing failed ', offset, ex);

      dispatch({ type: 'FETCH_WALL_DATA_FAIL', offset });
      const offsets = getState().failedRequestsOffsets;

      console.log('Failed requests offsets ', offsets);
      throw ex;
    });
};

/* eslint-disable max-statements */
export const searchInWallPosts = inputValues => (dispatch, getState) => {
  let offset = 0;
  let totalPostsAtWall;
  const searchStart = Date.now();
  const { token } = getState().tokenData;
  const authorId = Number(inputValues.authorId);
  // TODO: make postsAmount default value to be one of app config params
  const postsAmount = inputValues.postsAmount || postsAmountDefault;
  const { wallOwnerId, wallOwnerDomain, searchQuery } = inputValues;
  const baseApiReqUrl = 'https://api.vk.com/method/wall.get?' +
    `owner_id=${wallOwnerId}&domain=${wallOwnerDomain}&count=100` +
    `&access_token=${token}` +
    `&v=${apiVersion}` +
    '&extended=1';

  // NOTE: for situation when user press "Start/Stop" button
  clearInterval(wallPostsSearchIntervalId);
  dispatch({ type: 'CLEAR_RESULTS' });

  // TODO: extract as separate thunk
  const handleRequest = (currentOffset) => {
    return dispatch(fetchWallData(baseApiReqUrl, currentOffset))
      .then((response) => {
        totalPostsAtWall = response ? response.count : totalPostsAtWall;
        return response;
      })
      .then(response => parseSearchedPosts(response, authorId))
      .then(posts => formatSearchedPosts(posts))
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
      .catch(e => console.error(e));
  };

  wallPostsSearchIntervalId = setInterval(() => {
    if (getState().results.length < postsAmount) {
      if (!totalPostsAtWall || offset < totalPostsAtWall) {
        offset += 100;
        return handleRequest(offset);
      }
    }
    // NOTE: sorting and cutting will be done at render further
    // dispatch(sortResults(false));
    // dispatch(cutExcessResults(postsAmount));

    // TODO: add and check pending requests state                                !!!
    const offsets = getState().failedRequestsOffsets;
    if (offsets.length > 0) {
      return handleRequest(offsets[0]);
    }
    return clearInterval(wallPostsSearchIntervalId);

    // NOTE: maybe add exit condition when get empty items(posts) few times
    // if (responseData.items.length = 0) { ... }
  }, requestInterval);
  handleRequest(offset);
};
