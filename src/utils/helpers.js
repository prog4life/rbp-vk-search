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

export const maybeThrowResponseError = (response) => {
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
