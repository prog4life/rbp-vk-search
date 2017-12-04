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

const fetchWallDataJSONP = (baseAPIReqUrl, offset) => (dispatch, getState) => {
  const currentAPIReqUrl = `${baseAPIReqUrl}&offset=${offset}`;

  dispatch(fetchWallDataRequest(offset));
  // console.log('api request url offset: ', offset);

  return fetchJSONP(currentAPIReqUrl, {
    timeout: jsonpTimeout // default - 5000
  })
    .then(res => res.json())
    .then((resJSON) => {
      dispatch(fetchWallDataSuccess(offset));
      // console.log('response: ', resJSON.response);
      return resJSON.response;
    })
    .catch((ex) => {
      console.warn('Parsing failed ', offset, ex);
      dispatch(fetchWallDataFail(offset));
      const { failedRequests } = getState();

      console.log('Failed requests: ', failedRequests);
      throw ex;
    });
};

export default fetchWallDataJSONP;
