import fetchJsonp from 'fetch-jsonp';
import initialConfig from '../api/initial';

let userPostsSearchIntervalId = null;

// export function prepareUserSearch(inputValues) {
//   handle user input, create api request params and place them to store  
// }

/* eslint-disable max-statements */
export const searchUserPosts = (inputValues) => (dispatch, getState) => {
  console.log(inputValues);
  const offset = 0;
  const totalPosts = 5000;
  const {token} = getState().tokenData;
  // TODO: make postsAmount default value to be one of app config params
  const authorId = Number(inputValues.authorId);
  const postsAmount = inputValues.postsAmount || 10;
  const {wallOwner, wallDomain, searchQuery} = inputValues;
  const apiReqUrl = `https://api.vk.com/method/wall.get?` +
    `owner_id=${wallOwner}&domain=${wallDomain}&count=100` +
    `&access_token=${token}` +
    `&v=${initialConfig.apiVersion}` +
    `&extended=1`;

  // TODO: replace this stuff to store searchParams
  const requestParams = {
    apiReqUrl,
    authorId,
    offset,
    totalPosts,
    postsAmount
  };

  // NOTE: for situation when user press "Stop" button
  clearInterval(userPostsSearchIntervalId);

  userPostsSearchIntervalId = setInterval(() => {
    dispatch(fetchWallPosts(requestParams));
  // TODO: add default for interval value and get it from config
  }, 500);
  dispatch(fetchWallPosts(requestParams));
};

export const fetchWallPosts = (requestParams) => (dispatch, getState) => {
  const {
    apiReqUrl,
    authorId,
    offset,
    totalPosts,
    postsAmount
  } = requestParams;

  if (getState().results.length < postsAmount && offset < totalPosts) {
    const currentApiReqUrl = `${apiReqUrl}&offset=${offset}`;

    console.log('api request url: ', currentApiReqUrl);

    // TODO: add "performUserPostsRequst" thunk:
    fetchJsonp(currentApiReqUrl, {
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

      dispatch(filterUserPosts(posts, authorId));

      // TODO: increase offset only if response.ok, count attempts here        !!!
      requestParams.offset += 100;

      // FIXME: temporarily hidden
      // requestParams.totalPosts = count;
    })
    .catch((ex) => {
      console.warn('Parsing failed', ex);
      // TODO: resolve, executes at the end
      // return makeFetchJsonpRequest(apiReqUrl);
    });

    // TODO: add stop condition when no more data
    // if (responseData.items.length = 0) {
    //   requestParams.totalPosts = 0:
    // }
    return;
  }
  // searchResults.length = 10; // FIXME: cut excess results
  clearInterval(userPostsSearchIntervalId);
};

export const filterUserPosts = (posts, authorId) => (dispatch) => {
  const userPostsChunk = posts.filter((post) => {
    return post.from_id === authorId;
  });

  if (userPostsChunk.length > 0) {
    // TODO: add formatResults;
    dispatch(addResults(userPostsChunk));
  }
  console.log('userPostsChunk ', userPostsChunk);

  return userPostsChunk;
};

export function addResults(results) {
  return {
    type: 'ADD_RESULTS',
    results
  };
}
