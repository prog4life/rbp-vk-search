import { apiVersion, tokenRequestURL } from 'config/common';
import fetchJSONP from './fetchJSONP';
import jsonpPromise from './jsonpPromise';

export const redirectToTokenRequestUrl = () => (
  window.location.assign(tokenRequestURL)
);

export const requestUserName = (id, token) => {
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
};

export const parseAccessTokenHash = (hash) => {
  if (!hash) {
    return false;
  }
  if (typeof hash !== 'string') {
    console.error('Hash must be string');
    return false;
  }
  // TODO: consider using decodeURIComponent
  const hashChunks = hash.split('&');
  const parsed = {};

  hashChunks.forEach((chunk) => {
    const [key, value = ''] = chunk.split('=');

    // TODO: consider saving empty string value
    if (!key || value.length < 1) {
      return;
    }
    parsed[key] = value;
  });

  const {
    access_token: accessToken,
    expires_in: expiresIn,
    user_id: userId = '',
    error,
    error_description: errorDescription,
  } = parsed;

  if (error) {
    console.error(`Hash has error: ${error}, description: ${errorDescription}`);
    return false;
  }

  let tokenExpiresAt = null;

  if (expiresIn) {
    tokenExpiresAt = Date.now() + (expiresIn * 1000);
    // tokenExpiresAt = moment().add(expiresIn, 'seconds').unix();
  }

  return {
    accessToken, tokenExpiresAt, userId, error, errorDescription,
  };
};
