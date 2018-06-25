import jsonp from 'jsonp-promise';

async function jsonpPromise(url) {
  const jsonpObj = jsonp(url, {
    timeout: 5000, // 0 to disable (defaults to 15000)
  });

  jsonpPromise.cancel = jsonpObj.cancel;
  const { response, error } = await jsonpObj.promise;

  if (error) {
    // throw new Error(JSON.stringify(error, null, 2));
    const err = new Error(error.error_msg);

    err.code = error.error_code;
    err.requestParams = error.request_params;
    throw err;
  }
  if (response) {
    return response;
  }
  throw new Error('Empty response');
}

export default jsonpPromise;
