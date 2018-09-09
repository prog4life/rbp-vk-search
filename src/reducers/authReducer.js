import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_CANCEL,
  LOGOUT,
  // OFFER_AUTH,
  REJECT_AUTH_OFFER,
} from 'constants/actionTypes';
import { AUTH_OFFER_DELAY } from 'constants/ui';

const defaultState = {
  isAuthenticating: false,
  isLoggedIn: false,
  tokenExpiresAt: null,
  userName: '',
  userPageHref: '',
  hasAuthOffer: true,
  authOfferDelay: AUTH_OFFER_DELAY,
};

const authReducer = (state = defaultState, action) => {
  const { type, session } = action; // session can be null
  const { user } = session || {};

  switch (type) {
    case LOGIN:
      return { ...state, isAuthenticating: true, hasAuthOffer: false };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isAuthenticating: false,
        userName: `${user.first_name || ''} ${user.last_name || ''}`, // TEMP:
        userPageHref: user.href,
      };
    case LOGIN_FAIL:
      return { ...state, isLoggedIn: false, isAuthenticating: false };
    case LOGIN_CANCEL:
      return { ...state, isLoggedIn: false, isAuthenticating: false };
    case LOGOUT: // is returning of defaultState correct?
      return { ...state, isLoggedIn: false, userName: '', userPageHref: '' };
    // case SIGN_OUT: // is returning of defaultState correct?
    //   return defaultState;
    // case OFFER_AUTH: // TODO: rename to AUTH_MISSING or NOT_AUTHENTICATED
    //   return {
    //     ...state,
    //     hasAuthOffer: true,
    //     authOfferDelay: 0,
    //   };
    case REJECT_AUTH_OFFER:
      return {
        ...state,
        hasAuthOffer: false,
        authOfferDelay: 0, // next time without delay
      };
    default:
      return state;
  }
};

export default authReducer;

export const getUserName = state => state.userName;
export const getUserPageHref = state => state.userPageHref;
export const isAuthenticating = state => state.isAuthenticating;
export const isLoggedIn = state => state.isLoggedIn;
export const hasAuthOffer = state => state.hasAuthOffer;
export const getAuthOfferDelay = state => state.authOfferDelay;
