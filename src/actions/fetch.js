import fetchJSONP from 'fetch-jsonp';
import { jsonpTimeout } from 'config/api';

export const fetchWallDataRequest = offset => ({
  type: 'FETCH_WALL_DATA_REQUEST',
  offset
});

export const fetchWallDataSuccess = offset => ({
  type: 'FETCH_WALL_DATA_SUCCESS',
  offset
});

export const fetchWallDataFail = offset => ({
  type: 'FETCH_WALL_DATA_FAIL',
  offset
});

// const fetchWallDataJSONP = (baseAPIReqUrl, offset) => (dispatch, getState) => {
const fetchWallDataJSONP = (currentAPIReqUrl, offset) => (dispatch, getState) => {
  // const currentAPIReqUrl = `${baseAPIReqUrl}&offset=${offset}`;

  dispatch(fetchWallDataRequest(offset));
  // console.log('api request url offset: ', offset);

  return fetchJSONP(currentAPIReqUrl, {
    timeout: jsonpTimeout // default - 5000
  })
    .then((res) => {
      return res.json();
    })
    // NOTE: without access_token:
    // resJSON = {
    //   error: {
    //     error_code: 8,
    //     error_msg: "Invalid request: method is unavailable without access token",
    //     request_params: [{}, {}]
    //   }
    // };
    .then((resJSON) => {
      // TODO: check for !error and !response
      dispatch(fetchWallDataSuccess(offset));
      // console.log('response: ', resJSON.response);
      return resJSON.response;
    })
    .catch((ex) => {
      console.warn('Fetching failed ', offset, ex);
      dispatch(fetchWallDataFail(offset));
      const { failedRequests } = getState();

      console.log('Failed requests: ', failedRequests);
      throw ex;
    });
};

export default fetchWallDataJSONP;
