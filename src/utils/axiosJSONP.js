import { jsonpTimeout } from 'config/common';
import axios from 'axios-jsonp-pro';

export default function axiosJSONP(url, customTimeout = jsonpTimeout) {
  return axios.jsonp(url, {
    // url
    // ...customTimeout ? { timeout: customTimeout } : {},
    timeout: customTimeout,
  })
    .then((resData) => {
      if (resData.error) {
        const { error_code, error_msg, request_params } = resData.error;
        // throw Error(JSON.stringify(resData.error, null, 2));
        throw Error(`code: ${error_code}, message: ${error_msg}, ` +
          `req params: ${JSON.stringify(request_params, null, 2)}`);
      }
      console.log('axiosJSONP response ', resData);
      return resData.response;
    });
}

