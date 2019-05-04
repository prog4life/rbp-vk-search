export const changeMssg = (error, newMessage) => {
  if (typeof newMessage !== 'string') {
    throw new TypeError('Expected second argument to be string');
  }
  if (error instanceof Error) {
    error.message = newMessage; // eslint-disable-line no-param-reassign
  } else {
    throw new TypeError('Expected first argument to be Error type');
  }
};

// TODO: change to more reusable form/create/extractError

export const createError = (error) => {
  let message = 'No error message';
  let err = null;

  if (error && typeof error === 'object') {
    // error_code, request_params, error_msg
    const { error_msg: errorMsg, ...rest } = error;
    try {
      message = JSON.stringify(error, null, 2);
    } catch (e) {
      message = errorMsg || error.message || message;
    }
    err = new Error(message);
    Object.keys(rest).forEach((key) => { err[key] = rest[key]; });
  }
  if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Incorrect error data was provided';
  }
  return err || new Error(message);
};

export const maybeThrowResponseError = (response) => {
  if (response && response.error) {
    throw createError(response.error);
  }
  return response;
};

// {
//   "error": {
//     "error_code": 100,
//     "error_msg": "One of the parameters specified was missing or invalid:
//       offset without start_comment_id should be positive",
//     "request_params": [{
//       "key": "oauth",
//       "value": "1"
//     }, {
//       "key": "method",
//       "value": "wall.getComments"
//     }, {
//       "key": "count",
//       "value": "1"
//     }, {
//       "key": "extended",
//       "value": "1"
//     }, {
//       "key": "need_likes",
//       "value": "1"
//     }, {
//       "key": "offset",
//       "value": "-2424"
//     }, {
//       "key": "owner_id",
//       "value": "85635407"
//     }, {
//       "key": "post_id",
//       "value": "3199"
//     }, {
//       "key": "v",
//       "value": "5.80"
//     }]
//   }
// }
