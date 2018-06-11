import { tokenRequestURL } from 'config/common';

export const redirectToTokenRequestUrl = () => (
  window.location.assign(tokenRequestURL)
);

export const parseAccessTokenHash = (hash) => {
  if (!hash) {
    return false;
  }
  if (typeof hash !== 'string') {
    throw new Error('Hash must be string');
  }
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
    user_id: userId,
    error,
    error_description: errorDescription,
  } = parsed;

  let tokenExpiresAt = null;

  if (expiresIn) {
    tokenExpiresAt = Date.now() + (Number(expiresIn) * 1000);
    // tokenExpiresAt = moment().add(Number(expiresIn), 'seconds').unix();
  }

  // TODO: error -> errorCode, if it is code actually

  return {
    accessToken, tokenExpiresAt, userId, error, errorDescription,
  };
};
