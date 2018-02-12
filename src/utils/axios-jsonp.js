import { jsonpTimeout } from 'config/common';
import axios from 'axios-jsonp-pro';

export default function axiosJSONP(url, customTimeout) {
  return axios.jsonp(url, {
    // url
    // timeout: 700
  })
    .then((resData) => {
      if (resData.error) {
        throw Error(JSON.stringify(resData.error, null, 2));
      }
      console.log('axios response ', resData);
      return resData.response;
    });
}
