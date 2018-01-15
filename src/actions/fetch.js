import fetchJSONP from 'fetch-jsonp';
import { jsonpTimeout } from 'config/common';

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
const fetchWallDataJSONP = (currentAPIReqUrl, offset) => dispatch => (
  // const currentAPIReqUrl = `${baseAPIReqUrl}&offset=${offset}`;

  // dispatch(fetchWallDataRequest(offset));
  // console.log('api request url offset: ', offset);

  fetchJSONP(currentAPIReqUrl, {
    timeout: jsonpTimeout // default - 5000
  })
    .then(res => (
      res.json()
    ))
    // NOTE: without access_token:
    // resData = {
    //   error: {
    //     error_code: 8,
    //     error_msg: "Invalid request: method is unavailable without access token",
    //     request_params: [{}, {}]
    //   }
    // };
    .then((resData) => {
      const { response, error } = resData;
      if (!response) {
        if (error) {
          throw new Error(JSON.stringify(resData));
        }
        throw new Error('Empty response');
      }
      // dispatch(fetchWallDataSuccess(offset));
      // console.log('response: ', resJSON.response);
      return resData.response;
    })
    .catch((ex) => {
      console.warn('Fetching failed ', offset, ex);
      // dispatch(fetchWallDataFail(offset));
      // const { failedRequests } = getState();

      // console.log('Failed requests: ', failedRequests);
      throw ex;
    })
);

export default fetchWallDataJSONP;
