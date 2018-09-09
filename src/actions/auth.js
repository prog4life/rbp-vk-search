import openAPI from 'utils/openAPI';
import {
  LOGIN,
  LOGIN_CANCEL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  // SIGN_OUT,
  REJECT_AUTH_OFFER,
  OFFER_AUTH,
  // NO_VALID_TOKEN,
} from 'constants/actionTypes';
import { isAuthenticatingSelector } from 'selectors';

// TODO: terminate search on sign out
export const login = () => (dispatch, getState) => {
  const isAuthenticating = isAuthenticatingSelector(getState());

  const delay = ms => piped => new Promise((resolve) => {
    setTimeout(() => resolve(piped), ms);
  });

  if (isAuthenticating) {
    return Promise.reject();
  }
  dispatch({ type: LOGIN });
  // should be invoked in response to user action to prevent auth popup block
  return openAPI.login().then(delay(3000)).then(
    (response) => {
      if (response.status !== 'connected') {
        return dispatch({ type: LOGIN_CANCEL, ...response });
      }
      return dispatch({ type: LOGIN_SUCCESS, ...response });
    },
    (error) => {
      dispatch({ type: LOGIN_FAIL, error });
      return Promise.reject(error);
    },
  );
};

export const logout = () => ({ type: LOGOUT });
// export const signOut = () => ({ type: SIGN_OUT });

// export const offerAuth = () => ({ type: OFFER_AUTH });
// TODO: dispatch it where it is reasonable
// export const noValidToken = () => ({ type: NO_VALID_TOKEN });
export const rejectAuthOffer = () => ({ type: REJECT_AUTH_OFFER });
