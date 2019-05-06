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
    response => dispatch({ type: LOGIN_SUCCESS, ...response }),
    (error) => {
      const { message, status } = error;
      if (status) {
        return dispatch({ type: LOGIN_CANCEL, status, error: message });
      }
      dispatch({ type: LOGIN_FAIL, error: message });
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

export const subscribeToLogout = () => (dispatch) => {
  const handler = response => dispatch({ type: LOGOUT_SUCCESS, ...response });
  openAPI.onLogout(handler);
  return handler;
};

// call without handler to remove all subscribers to 'auth.logout' event
export const unsubscribeFromLogout = handler => () => (
  openAPI.onLogout(handler, false)
);

// export const offerAuth = () => ({ type: OFFER_AUTH });
// TODO: dispatch it where it is reasonable
// export const noValidToken = () => ({ type: NO_VALID_TOKEN });
export const rejectAuthOffer = () => ({ type: REJECT_AUTH_OFFER });
