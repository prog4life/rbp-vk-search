import { apiVersion } from 'config/common';
import fetchJSONP from './fetchJSONP';
// import jsonpPromise from './jsonpPromise';

export default function requestUserName(id, token) {
  const endpoint = 'https://api.vk.com/method/users.get?' +
    `user_ids=${id}&access_token=${token}&v=${apiVersion}`;

  return fetchJSONP(endpoint, 5000).then(
    (response) => {
      const [{ first_name: firstName, last_name: lastName }] = response;

      if (firstName.length && lastName.length) {
        return `${firstName} ${lastName}`;
      }
      throw new Error('First name or last name is not present in response');
    },
    (e) => {
      console.error(e);
      throw new Error(`Failed to load user name, reason: ${e.message}`);
    },
  );
}
