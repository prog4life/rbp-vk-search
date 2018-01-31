import moment from 'moment';

// TODO: split into 2 distinct actions
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

export const parseAccessTokenHash = hash => (dispatch) => {
  if (!hash) {
    return false;
  }
  if (typeof hash !== 'string') {
    console.error('Hash must be string');
    return false;
  }
  // TODO: consider using decodeURIComponent
  const hashChunks = hash.split('&');
  const result = {};

  hashChunks.forEach((chunk) => {
    const [key, value = ''] = chunk.split('=');

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
    console.error(`Hash has error: ${error}, description: ${errorDescription}`);
    return false;
  }

  if (accessToken) {
    let tokenExpiresAt = null;

    if (expiresIn) {
      // const tokenExpiresAt = Date.now() + (expiresIn * 1000);
      tokenExpiresAt = moment().add(expiresIn, 'seconds').unix();
    }
    dispatch(saveAccessToken(accessToken, tokenExpiresAt));

    if (userId) {
      dispatch(setUserId(userId));
    }
    return result;
  }
  return false;
};
