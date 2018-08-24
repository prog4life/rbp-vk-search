import fetchWithJSONP from 'fetch-jsonp';
import { jsonpTimeout } from 'config/common';
import { maybeThrowResponseError } from 'utils/helpers';

// const getObjectFromJSON = response => response.json();

// vk API error response example:
// resData = {
//   error: {
//     error_code: 8,
//     error_msg: "Invalid request: method is unavailable without access token",
//     request_params: [{}, {}]
//   }
// };

const throwIfEmptyOrError = (resData) => {
  const { response } = resData;

  maybeThrowResponseError(resData);

  if (response) {
    return response;
  }
  throw new Error('Empty response');
};

// TODO: think over timeout modifying functionality
const fetchJSONP = (url, updatedTimeout) => (
  fetchWithJSONP(url, {
    timeout: updatedTimeout || jsonpTimeout, // default - 5000
  })
    .then(response => response.json())
    // .then(maybeThrowResponseError)
    .then(throwIfEmptyOrError)
);

export default fetchJSONP;
