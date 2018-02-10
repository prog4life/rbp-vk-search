import fetchJsonp from 'fetch-jsonp';
import { jsonpTimeout } from 'config/common';

const getObjectFromJson = response => response.json();

// vk API error response example:
// resData = {
//   error: {
//     error_code: 8,
//     error_msg: "Invalid request: method is unavailable without access token",
//     request_params: [{}, {}]
//   }
// };

const throwIfEmptyOrError = (resData) => {
  const { response, error, ok } = resData;

  if (response) {
    return response;
  }

  if (error || !ok) {
    throw new Error(JSON.stringify(resData, null, 2)); // need to stringify?
  }
  throw new Error('Empty response');
};

// TODO: think over timeout modifying functionality
const fetchJSONP = (url, updatedTimeout) => (
  fetchJsonp(url, {
    timeout: updatedTimeout || jsonpTimeout // default - 5000
  })
    .then(getObjectFromJson)
    .then(throwIfEmptyOrError)
);

export default fetchJSONP;