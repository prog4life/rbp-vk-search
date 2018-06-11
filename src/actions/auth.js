// import moment from 'moment';
import { getAccessToken } from 'selectors';
import { redirectToTokenRequestUrl, parseAccessTokenHash } from 'utils/accessToken';
import requestUserName from 'utils/userName';

import {
  SAVE_AUTH_DATA,
  SET_USER_NAME,
  FETCH_USER_NAME_FAIL,
  SIGN_OUT,
  NO_VALID_TOKEN,
  RECEIVE_TOKEN_ERROR,
  REDIRECT_TO_AUTH,
  OFFER_AUTH_REDIRECT,
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

// TODO: terminate search on sign out
export const signOut = () => ({ type: SIGN_OUT });

// TODO: dispatch it where it is reasonable
export const noValidToken = () => ({ type: NO_VALID_TOKEN });
export const offerAuthRedirect = () => ({ type: OFFER_AUTH_REDIRECT });
export const fetchUserNameFail = () => ({ type: FETCH_USER_NAME_FAIL });

export const redirectToAuth = () => {
  redirectToTokenRequestUrl();
  return { type: REDIRECT_TO_AUTH };
};

export const setUserName = userName => ({
  type: SET_USER_NAME,
  userName,
});

export const fetchUserName = (userId, token) => (dispatch, getState) => {
  const accessToken = token || getAccessToken(getState());
  // TODO: replace by selector
  requestUserName(userId, accessToken).then(
    userName => dispatch(setUserName(userName)),
    () => dispatch(fetchUserNameFail()),
  );
};

export const receiveTokenError = (error = null, description) => ({
  type: RECEIVE_TOKEN_ERROR,
  error,
  description: description || 'Failed to retrieve auth data or error details',
});

export const saveAuthData = (accessToken, tokenExpiresAt, userId = '') => ({
  type: SAVE_AUTH_DATA,
  accessToken,
  tokenExpiresAt,
  userId,
});

export const extractAuthData = hash => (dispatch) => {
  const parsedHash = parseAccessTokenHash(hash);
  const { accessToken, tokenExpiresAt, userId, error } = parsedHash;

  if (error) {
    dispatch(receiveTokenError(error, parsedHash.errorDescription));
  }
  if (!accessToken) {
    return false;
  }
  dispatch(saveAuthData(accessToken, tokenExpiresAt, userId));

  // TODO: consider to use out of here
  if (userId) {
    dispatch(fetchUserName(userId, accessToken));
  }
  return parsedHash;
};
