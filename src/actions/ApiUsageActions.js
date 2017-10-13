import fetchJsonp from 'fetch-jsonp';
import initialConfig from '../api/initial';

// let userPostsSearchIntervalId = null;

export function prepareUserPostsSearch(inputValues) {
  /* eslint-disable max-statements */
  return (dispatch, getState) => {
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

    // TODO: replace this stuff to in-store searchParams

    return {
      apiReqUrl,
      authorId,
      offset,
      totalPosts,
      postsAmount
    };
  };
}

export function fetchUserPosts(requestParams, userPostsSearchIntervalId) {
  const {
    apiReqUrl,
    authorId,
    offset,
    totalPosts,
    postsAmount
  } = requestParams;

  return (dispatch, getState) => {
    if (getState().results.length < postsAmount && offset < totalPosts) {
      const currentApiReqUrl = `${apiReqUrl}&offset=${offset}`;

      dispatch(makeFetchJsonpRequest(currentApiReqUrl))
      // TODO: increase offset only if response.ok, count attempts here        !!!
      .then((resJSON) => {
        // TODO: replace it to makeFetchJsonpRequest
        dispatch(filterUserPosts(resJSON, authorId, totalPosts));
      })
      .catch((err) => {
        console.log('from catch state: ', getState());
        console.warn(err);
      });

      requestParams.offset += 100;
      return;
    }
    // searchResults.length = 10; // FIXME: cut excess results
    clearInterval(userPostsSearchIntervalId);
    console.log('userPostSearchResults: ', getState().results);
  };
}

export function makeFetchJsonpRequest(apiReqUrl) {
  return (dispatch) => {
    console.log('api call url: ', apiReqUrl);

    return fetchJsonp(apiReqUrl, {
      // to set custom callback param name (default - callback)
      // jsonpCallback: 'custom_callback',
      // to specify custom function name that will be used as callback,
      // default - jsonp_some-number
      // jsonpCallbackFunction: 'function_name_of_jsonp_response',
      // timeout: 3000 // default - 5000
    })
    .then((response) => (
      response.json()
    ))
    // .then((json) => {
    //   const responseData = json.response;
    //
    //   console.log('response from parsed json', responseData);
    //   return responseData;
    // })
    .catch((ex) => {
      console.log('parsing failed', ex);
      // TODO: resolve, executes at the end
      // return makeFetchJsonpRequest(apiReqUrl);
    });
  };
}

export function filterUserPosts(resJSON, authorId, totalPosts) {
  return (dispatch) => {
    const responseData = resJSON.response;
    // TODO: add stop condition when no more data
    // if (responseData.items.length = 0) {
    //   totalPosts = 0:
    // }
    const searchResultsChunk = responseData.items.filter((item) => {
      return item.from_id === authorId;
    });

    if (searchResultsChunk.length > 0) {
      // TODO: add formatResults;
      dispatch(addResults(searchResultsChunk));
    }
    console.log('response from parsed json ', responseData);
    console.log('searchResultsChunk ', searchResultsChunk);
    // FIXME: temporarily hidden
    // totalPosts = responseData.count;

    return searchResultsChunk;
  };
}

export function addResults(results) {
  return {
    type: 'ADD_RESULTS',
    results
  };
}
