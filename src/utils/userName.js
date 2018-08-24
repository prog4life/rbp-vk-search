import { apiVersion } from 'config/common';
import { maybeThrowResponseError } from 'utils/apiClient';
import fetchJSONP from './fetchJSONP';
// import jsonpPromise from './jsonpPromise';

export default function requestUserName(id, token) {
  const endpoint = 'https://api.vk.com/method/users.get?'
    + `user_ids=${id}&access_token=${token}&v=${apiVersion}`;

  return fetchJSONP(endpoint, 5000).then(
    (response) => {
      maybeThrowResponseError(response);

      const [{ first_name: first = '', last_name: last = '' }] = response;

      if (first.length || last.length) {
        const lastName = first.length > 0 ? ` ${last}` : last;
        return `${first}${lastName}`;
      }
      throw new Error('No first name or last name in response');
    },
    (error) => {
      const err = recreateError(
        error,
        mssg => `Failed to load user name, reason: ${mssg}`,
      );
      throw err;
    },
  );
}

/*
{
  "error": {
    "error_code": 100,
    "error_msg": "One of the parameters specified was missing or invalid:
      offset without start_comment_id should be positive",
    "request_params": [{
      "key": "oauth",
      "value": "1"
    }, {
      "key": "method",
      "value": "wall.getComments"
    }, {
      "key": "count",
      "value": "1"
    }, {
      "key": "extended",
      "value": "1"
    }, {
      "key": "need_likes",
      "value": "1"
    }, {
      "key": "offset",
      "value": "-2424"
    }, {
      "key": "owner_id",
      "value": "85635407"
    }, {
      "key": "post_id",
      "value": "3199"
    }, {
      "key": "v",
      "value": "5.80"
    }]
  }
}

*/
