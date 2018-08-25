// import moment from 'moment';
import { getAccessToken } from 'selectors';
import { parseAccessTokenHash } from 'utils/accessToken';
import { requestUserName } from 'utils/apiUsage';
import { createError } from 'utils/errorHelpers';

import {
  LOGIN,
  LOGIN_CANCEL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SAVE_AUTH_DATA,
  FETCH_USER_NAME,
  FETCH_USER_NAME_SUCCESS,
  FETCH_USER_NAME_FAIL,
  // SIGN_OUT,
  ACCESS_TOKEN_ERROR,
} from 'constants/actionTypes';

// TODO: terminate search on sign out
export const login = () => (dispatch, getState) => {
  // const isAuthenticating = isAuthenticatingSelector(getState());

  // if (isAuthenticating) {
  //   return Promise.reject();
  // }
  dispatch({ type: LOGIN });
  // should be invoked in response to user action to prevent auth popup block
  VK.Auth.login((response) => {
    const { session, settings, error } = response;

    if (error) {
      dispatch({ type: LOGIN_FAIL, error: createError(error) });
      return;
    }

    if (session) {
      if (settings) {
        /* Выбранные настройки доступа пользователя, если они были запрошены */
        dispatch({ type: LOGIN_SUCCESS, session, settings });
        return;
      }
      dispatch({ type: LOGIN_SUCCESS, session });
    } else {
      /* Пользователь нажал кнопку Отмена в окне авторизации */
      dispatch({ type: LOGIN_CANCEL });
    }
  } /* , settings: Integer */);
};

export const logout = () => ({ type: LOGOUT });
// export const signOut = () => ({ type: SIGN_OUT });
// export const fetchUsername = () => ({ type: FETCH_USER_NAME });

export const fetchUserNameSuccess = userName => ({
  type: FETCH_USER_NAME_SUCCESS,
  userName,
});
export const fetchUserNameFail = ({ code = null, message, params = null }) => ({
  type: FETCH_USER_NAME_FAIL,
  error: { code, message, params },
});

export const fetchUserName = (userId, token) => (dispatch, getState) => {
  const accessToken = token || getAccessToken(getState());

  dispatch({ type: FETCH_USER_NAME });

  requestUserName(userId, accessToken).then(
    userName => dispatch(fetchUserNameSuccess(userName)),
    error => dispatch(fetchUserNameFail(error)),
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
    return false;
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
