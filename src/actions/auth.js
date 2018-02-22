import moment from 'moment';
import { apiVersion } from 'config/common';
import fetchJSONP from 'utils/fetch';

// TODO: split into 2 distinct actions ?
export const saveAccessToken = (accessToken, tokenExpiresAt) => ({
  type: 'SAVE_ACCESS_TOKEN',
  accessToken,
  tokenExpiresAt
});

export const setTokenExpiry = expiresAt => ({
  type: 'SET_TOKEN_EXPIRY',
  expiresAt
});

// TODO: terminate search on sign out
export const signOut = () => ({
  type: 'SIGN_OUT'
});

export const setUserId = userId => ({
  type: 'SET_USER_ID',
  userId
});

export const setUserName = userName => ({
  type: 'SET_USER_NAME',
  userName
});

export const getUserName = (id) => {
  const url = `https://api.vk.com/method/users.get?` +
    `user_ids=${id}&v=${apiVersion}`;

  return fetchJSONP(url, 5000).then((response) => {
    const [{ first_name: firstName, last_name: lastName }] = response;

    return `${firstName} ${lastName}`;
  }).catch(e => console.warn(e));
};

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
      getUserName(userId).then(userName => dispatch(setUserName(userName)));
    }
    return result;
  }
  return false;
};
