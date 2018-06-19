import {
  SAVE_AUTH_DATA,
  SET_USER_NAME,
  REDIRECT_TO_AUTH,
  REJECT_AUTH_REDIRECT,
  OFFER_AUTH_REDIRECT,
  SIGN_OUT,
} from 'constants/actionTypes';

const defaultState = {
  accessToken: null,
  tokenExpiresAt: null,
  userId: '',
  userName: '',
  isRedirecting: false,
  hasAuthOffer: false,
  hasDelayedAuthOffer: false,
};

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_AUTH_DATA:
      return {
        ...state,
        accessToken: action.accessToken,
        tokenExpiresAt: action.tokenExpiresAt,
        userId: action.userId,
      };
    case SET_USER_NAME:
      return {
        ...state,
        userName: action.userName,
      };
    case REDIRECT_TO_AUTH:
      return {
        ...state,
        isRedirecting: true,
        hasAuthOffer: false,
        hasDelayedAuthOffer: false,
      };
    case OFFER_AUTH_REDIRECT:
      return {
        ...state,
        hasAuthOffer: !action.hasDelay,
        hasDelayedAuthOffer: action.hasDelay,
      };
    case REJECT_AUTH_REDIRECT:
      return {
        ...state,
        hasAuthOffer: false,
        hasDelayedAuthOffer: false,
      };
    case SIGN_OUT: // is returning of defaultState correct?
      return defaultState;
    default:
      return state;
  }
};

export default authReducer;

export const getUserId = state => state.userId;
export const getUserName = state => state.userName;
