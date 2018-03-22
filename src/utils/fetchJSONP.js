import fetchJsonp from 'fetch-jsonp';
import { jsonpTimeout } from 'config/common';

const getObjectFromJSON = response => response.json();

// vk API error response example:
// resData = {
//   error: {
//     error_code: 8,
//     error_msg: "Invalid request: method is unavailable without access token",
//     request_params: [{}, {}]
//   }
// };

const throwIfEmptyOrError = (resData) => {
  const { response, error } = resData;

  if (error) {
    throw new Error(JSON.stringify(resData.error, null, 2));
  }
  if (response) {
    return response;
  }
  throw new Error('Empty response');
};

// TODO: think over timeout modifying functionality
const fetchJSONP = (url, updatedTimeout) => (
  fetchJsonp(url, {
    timeout: updatedTimeout || jsonpTimeout, // default - 5000
  })
    .then(getObjectFromJSON)
    .then(throwIfEmptyOrError)
);

export default fetchJSONP;
