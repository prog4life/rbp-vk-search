// import moment from 'moment';
import { getAuthData } from 'reducers';
import { apiVersion, tokenRequestURL } from 'config/common';
import fetchJSONP from 'utils/fetchJSONP';

import {
  SAVE_AUTH_DATA,
  SET_USER_NAME,
  SIGN_OUT,
  NO_TOKEN,
  TOKEN_EXPIRED,
  REDIRECT_FOR_TOKEN,
} from 'constants/actionTypes';

// TODO: split into 2 distinct actions ?
// export const saveAccessToken = (accessToken, tokenExpiresAt) => ({
//   type: 'SAVE_ACCESS_TOKEN',
//   accessToken,
//   tokenExpiresAt,
// });

// export const setTokenExpiry = expiresAt => ({
//   type: 'SET_TOKEN_EXPIRY',
//   expiresAt,
// });

// export const setUserId = userId => ({
//   type: 'SET_USER_ID',
//   userId,
// });

export const saveAuthData = (accessToken, tokenExpiresAt, userId) => ({
  type: SAVE_AUTH_DATA,
  accessToken,
  tokenExpiresAt,
  userId,
});

// TODO: terminate search on sign out
export const signOut = () => ({
  type: SIGN_OUT,
});

export const setUserName = userName => ({
  type: SET_USER_NAME,
  userName,
});

export const getUserName = (id) => {
  const url = `https://api.vk.com/method/users.get?` +
    `user_ids=${id}&v=${apiVersion}`;

  return fetchJSONP(url, 5000).then((response) => {
    const [{ first_name: firstName, last_name: lastName }] = response;

    return `${firstName} ${lastName}`;
  }).catch(e => console.warn(e));
};

export const checkAccessToken = () => (dispatch, getState) => {
  const { accessToken, tokenExpiresAt } = getAuthData(getState());

  if (!accessToken) {
    dispatch({ type: NO_TOKEN });
    return false;
  }
  if (tokenExpiresAt < Date.now() - (6 * Math.pow(10, 5))) { // try **
    dispatch({ type: TOKEN_EXPIRED });
    return false;
  }
  return accessToken;
};

export const redirectForToken = () => {
  window.location.assign(tokenRequestURL);

  return {
    type: REDIRECT_FOR_TOKEN,
  };
};

// TODO: rename to extractAuthData, save errors to store
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
    user_id: userId = '',
    error,
    error_description: errorDescription,
  } = result;

  if (error) {
    console.error(`Hash has error: ${error}, description: ${errorDescription}`);
    return false;
  }

  if (accessToken) {
    let tokenExpiresAt = null;

    if (expiresIn) {
      tokenExpiresAt = Date.now() + (expiresIn * 1000);
      // tokenExpiresAt = moment().add(expiresIn, 'seconds').unix();
    }
    // dispatch(saveAccessToken(accessToken, tokenExpiresAt)); // TODO: delete

    if (userId) {
      // dispatch(setUserId(userId)); // TODO: delete
      getUserName(userId).then(userName => dispatch(setUserName(userName)));
    }
    dispatch(saveAuthData(accessToken, tokenExpiresAt, userId));

    return result;
  }
  return false;
};
