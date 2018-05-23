// import moment from 'moment';
import { getAuthData, getAccessToken } from 'selectors';
import {
  requestUserName, redirectToTokenRequestUrl, parseAccessTokenHash,
} from 'utils/api';

import {
  SAVE_AUTH_DATA,
  SET_USER_NAME,
  SIGN_OUT,
  NO_TOKEN,
  TOKEN_EXPIRED,
  REDIRECT_TO_AUTH,
  OFFER_AUTH_REDIRECT,
} from 'constants/actionTypes';

const EXTRACT_TOKEN_ERROR = 'EXTRACT_TOKEN_ERROR';
const FETCH_USER_NAME_FAIL = 'FETCH_USER_NAME_FAIL';

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

export const saveAuthData = (accessToken, tokenExpiresAt, userId = '') => ({
  type: SAVE_AUTH_DATA,
  accessToken,
  tokenExpiresAt,
  userId,
});

// TODO: terminate search on sign out
export const signOut = () => ({ type: SIGN_OUT });

export const extractTokenError = (error = null, description) => ({
  type: EXTRACT_TOKEN_ERROR,
  error,
  description: description || 'Failed to retrieve auth data or error details',
});

export const setUserName = userName => ({
  type: SET_USER_NAME,
  userName,
});

export const fetchUserNameFail = () => ({ type: FETCH_USER_NAME_FAIL });

export const fetchUserName = (userId, token) => (dispatch, getState) => {
  const accessToken = token || getAccessToken(getState());
  // TODO: replace by selector
  requestUserName(userId, accessToken).then(
    userName => dispatch(setUserName(userName)),
    () => dispatch(fetchUserNameFail()),
  );
};

// TODO: remove, selector is used instead
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

export const redirectToAuth = () => {
  redirectToTokenRequestUrl();
  return { type: REDIRECT_TO_AUTH };
};

export const offerAuthRedirect = () => ({ type: OFFER_AUTH_REDIRECT });

export const extractAuthData = hash => (dispatch) => {
  const parsedHash = parseAccessTokenHash(hash);
  const { accessToken, tokenExpiresAt, userId, error } = parsedHash;

  if (error) {
    dispatch(extractTokenError(error, parsedHash.errorDescription));
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
