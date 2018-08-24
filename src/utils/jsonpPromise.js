import jsonpPromise from 'jsonp-promise';
import { maybeThrowResponseError } from 'utils/helpers';

async function jsonp(url) {
  const jsonpObj = jsonpPromise(url, {
    timeout: 5000, // 0 to disable (defaults to 15000)
  });

  // TEMP:
  jsonp.cancel = jsonpObj.cancel;
  const resData = await jsonpObj.promise;
  const { response } = resData;

  maybeThrowResponseError(resData);

  if (response) {
    return response;
  }
  throw new Error('Empty response');
}

export default jsonp;
