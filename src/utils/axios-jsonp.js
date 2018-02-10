import { jsonpTimeout } from 'config/common';
import axios from 'axios-jsonp-pro';

export default function axiosJSONP(url, customTimeout) {
  return axios.jsonp(url, {
    // url
    // timeout: 700
  })
    .then((response) => {
      // TODO: use timestamps - Date.now === timeout to track failed requests
      if (response.error) {
        throw Error(JSON.stringify(response, null, 2));
      }
      console.log('axios response ', response);
      return response.response;
    })
    .catch((error) => {
      throw error;
    });
}
