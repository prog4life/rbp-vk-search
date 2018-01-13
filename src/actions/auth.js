import moment from 'moment';

export const saveAccessToken = (accessToken, tokenExpiresAt) => ({
  type: 'SAVE_ACCESS_TOKEN',
  accessToken,
  tokenExpiresAt
});

export const setTokenExpiry = expiresAt => ({
  type: 'SET_TOKEN_EXPIRY',
  expiresAt
});

export const setUserId = userId => ({
  type: 'SET_USER_ID',
  userId
});

export const tokenRequestError = (error, errorDescription) => ({
  type: 'TOKEN_REQUEST_ERROR',
  error,
  errorDescription
});

export const parseAccessTokenHash = hash => (dispatch) => {
  if (!hash) {
    return false;
  }
  if (typeof hash !== 'string') {
    return false;
  }
  // TODO: consider using decodeUriComponent
  const hashChunks = hash.split('&');
  const result = {};

  hashChunks.forEach((chunk) => {
    const [key, value] = chunk.split('=');

    // TODO: consider saving empty string value
    if (!key || value.length < 1) {
      return;
    }
    result[key] = value;
  });

  const {
    access_token: accessToken,
    expires_in: expiresIn,
    user_id: userId,
    error,
    error_description: errorDescription
  } = result;

  if (error) {
    dispatch(tokenRequestError(error, errorDescription));
    return result;
  }

  if (accessToken) {
    let tokenExpiresAt;

    if (expiresIn) {
      // const tokenExpiresAt = Date.now() + (expiresIn * 1000);
      tokenExpiresAt = moment().add(expiresIn, 'seconds').unix();
    }
    dispatch(saveAccessToken(accessToken, tokenExpiresAt));
  }

  if (userId) {
    dispatch(setUserId(userId));
  }
  return result;
};
