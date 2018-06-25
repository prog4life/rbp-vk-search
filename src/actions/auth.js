// import moment from 'moment';
import { getAccessToken } from 'selectors';
import { parseAccessTokenHash } from 'utils/accessToken';
import requestUserName from 'utils/userName';

import {
  SAVE_AUTH_DATA,
  SET_USER_NAME,
  FETCH_USER_NAME_FAIL,
  SIGN_OUT,
  ACCESS_TOKEN_ERROR,
} from 'constants/actionTypes';

// TODO: terminate search on sign out
export const signOut = () => ({ type: SIGN_OUT });
export const fetchUserNameFail = () => ({ type: FETCH_USER_NAME_FAIL });

export const setUserName = userName => ({
  type: SET_USER_NAME,
  userName,
});

export const fetchUserName = (userId, token) => (dispatch, getState) => {
  const accessToken = token || getAccessToken(getState());

  // TODO: add request and success actions

  requestUserName(userId, accessToken).then(
    userName => dispatch(setUserName(userName)),
    () => dispatch(fetchUserNameFail()),
  );
};

export const accessTokenError = (error = null, description) => ({
  type: ACCESS_TOKEN_ERROR,
  error,
  description: description || 'Failed to retrieve auth data or error details',
});

export const saveAuthData = (accessToken, tokenExpiresAt, userId = '') => ({
  type: SAVE_AUTH_DATA,
  accessToken,
  tokenExpiresAt,
  userId,
});

export const extractAuthData = (hash, pathname) => (dispatch) => {
  const parsedHash = parseAccessTokenHash(hash);

  if (!parsedHash) {
    return false;
  }
  const { accessToken, tokenExpiresAt, userId, error } = parsedHash;

  // TODO: remove next line to parseAccessTokenHash ?
  // to clear URL hash
  window.history.replaceState(null, document.title, pathname);

  if (error) {
    dispatch(accessTokenError(error, parsedHash.errorDescription));
  }
  if (accessToken) {
    dispatch(saveAuthData(accessToken, tokenExpiresAt, userId));
  }

  // TODO: consider to use out of here
  // if (userId) {
  //   dispatch(fetchUserName(userId, accessToken));
  // }
  return parsedHash;
};
