import openAPI from 'utils/openAPI';
import { delayedReturn } from 'utils';
import {
  LOGIN,
  LOGIN_CANCEL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REJECT_AUTH_OFFER,
  OFFER_AUTH,
  // NO_VALID_TOKEN,
} from 'constants/actionTypes';
import { isAuthenticatingSelector } from 'selectors';

// TODO: terminate search on sign out
export const login = () => (dispatch, getState) => {
  const isAuthenticating = isAuthenticatingSelector(getState());

  if (isAuthenticating) {
    return Promise.reject();
  }
  dispatch({ type: LOGIN });
  // should be invoked in response to user action to prevent auth popup block
  return openAPI.login().then(delayedReturn(3000)).then(
    (response) => {
      if (response.status !== 'connected') {
        return dispatch({ type: LOGIN_CANCEL, ...response });
      }
      return dispatch({ type: LOGIN_SUCCESS, ...response });
    },
    (error) => {
      dispatch({ type: LOGIN_FAIL, error: error.message });
      return Promise.reject(error);
    },
  );
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  return openAPI.logout().then(
    response => dispatch({ type: LOGOUT_SUCCESS, ...response }),
    (error) => {
      dispatch({ type: LOGOUT_FAIL, error: error.message });
      return Promise.reject(error);
    },
  );
};

export const subscribeToLogout = () => dispatch => (
  openAPI.onLogout(() => dispatch({ type: LOGOUT_SUCCESS }))
);

// export const offerAuth = () => ({ type: OFFER_AUTH });
// TODO: dispatch it where it is reasonable
// export const noValidToken = () => ({ type: NO_VALID_TOKEN });
export const rejectAuthOffer = () => ({ type: REJECT_AUTH_OFFER });
