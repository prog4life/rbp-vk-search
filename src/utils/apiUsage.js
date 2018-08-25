import { apiVersion } from 'config/common';
import { changeMssg } from 'utils/errorHelpers';
import fetchJSONP from 'utils/fetchJSONP';
// import jsonp from 'utils/jsonpPromise';

// eslint-disable-next-line import/prefer-default-export
export function requestUserName(id, token) {
  const endpoint = 'https://api.vk.com/method/users.get?'
    + `user_ids=${id}&access_token=${token}&v=${apiVersion}`;

  return fetchJSONP(endpoint, 5000).then(
    (response) => {
      const [{ first_name: first = '', last_name: last = '' }] = response;

      if (first.length || last.length) {
        const lastName = first.length > 0 ? ` ${last}` : last;
        return `${first}${lastName}`;
      }
      throw new Error('No first name or last name in response');
    },
    (err) => {
      changeMssg(err, `Failed to load user name, reason: ${err.message}`);
      throw err;
    },
  );
}
