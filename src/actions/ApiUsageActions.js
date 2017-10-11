import fetchJsonp from 'fetch-jsonp';
import initialConfig from '../api/initial';

let userPostsSearchTimerId = null;

export function findUserPostsAtWall(inputValues) {
  /* eslint-disable max-statements */
  return (dispatch, getState) => {
    console.log(inputValues);
    let searchResults = [];
    let offset = 0;
    let total = 5000;
    const {token} = getState().tokenData;
    // TODO: make postsAmount default value to be one of app config params
    const authorId = Number(inputValues.authorId);
    const postsAmount = inputValues.postsAmount || 10;
    const {wallOwner, wallDomain, searchQuery} = inputValues;
    const apiCallUrl = `https://api.vk.com/method/wall.get?` +
      `owner_id=${wallOwner}&domain=${wallDomain}&count=100` +
      `&access_token=${token}` +
      `&v=${initialConfig.apiVersion}` +
      `&extended=1`;

    // NOTE: for situation when user press "Stop" button
    clearInterval(userPostsSearchTimerId);
    // TODO: create external handler func and pass it to setInterval;
    // consider collecting all posts at first or some amount of posts and
    // search among them at the intervals end
    userPostsSearchTimerId = setInterval(() => {
      if (searchResults.length < postsAmount && offset < total) {
        const tempApiCallUrl = `${apiCallUrl}&offset=${offset}`;

        dispatch(makeCallToAPI(tempApiCallUrl))
        .then((resJSON) => {
          const responseData = resJSON.response;
          // TODO: add stop condition when no more data
          // if (responseData.items.length = 0) {
          //   total = 0:
          // }
          const searchResultsChunk = responseData.items.filter((item) => {
            return item.from_id === authorId;
          });

          if (searchResultsChunk.length > 0) {
            console.log('addResults ', addResults(searchResultsChunk));
            console.log('dispatch addResults ', dispatch(addResults(searchResultsChunk)));
          }
          console.log('response from parsed json ', responseData);
          console.log('searchResultsChunk ', searchResultsChunk);
          // FIXME: temporarily hidden
          // total = responseData.count;
        })
        .catch((err) => {
          console.log('from catch state: ', getState());
          console.warn(err);
        });

        offset += 100;
        return;
      }
      // searchResults.length = 10; // FIXME: cut excess results
      clearInterval(userPostsSearchTimerId);
      console.log('userPostSearchResults: ', searchResults);
    }, 500);
  };
}

export function makeCallToAPI(apiCallUrl) {
  return (dispatch) => {
    console.log('api call url: ', apiCallUrl);

    return fetchJsonp(apiCallUrl, {
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
      // return makeCallToAPI(apiCallUrl);
    });
  };
}

export function filterUserPostsFromResJSON(resJSON) {
  return (dispatch) => {
    const responseData = resJSON.response;
    // TODO: add stop condition when no more data
    // if (responseData.items.length = 0) {
    //   total = 0:
    // }
    const searchResultsChunk = responseData.items.filter((item) => {
      return item.from_id === authorId;
    });

    if (searchResultsChunk.length > 0) {
      dispatch(addResults(searchResultsChunk));
    }
    console.log('response from parsed json ', responseData);
    console.log('searchResultsChunk ', searchResultsChunk);

    return searchResultsChunk;
  };
}

export function addResults(results) {
  return {
    type: 'ADD_RESULTS',
    results
  };
}
