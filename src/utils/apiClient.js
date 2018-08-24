// OR callAPI

const maybeThrowResponseError = (response) => {
  if (response && response.error) {
    const {
      error_code: code = null,
      error_msg: message = 'No error message',
      request_params: params,
    } = response.error;
    const err = new Error(message);

    err.code = code;
    err.params = params ? JSON.stringify(params, null, 2) : null;

    throw err;
  }
};
// eslint-disable-next-line import/prefer-default-export
export { maybeThrowResponseError };
