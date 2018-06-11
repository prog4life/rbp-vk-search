import { tokenRequestURL } from 'config/common';

export const redirectToTokenRequestUrl = () => (
  window.location.assign(tokenRequestURL)
);

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

  // TODO: error -> errorCode, if it is code actually

  return {
    accessToken, tokenExpiresAt, userId, error, errorDescription,
  };
};
