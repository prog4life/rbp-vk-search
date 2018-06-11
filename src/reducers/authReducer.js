import {
  SAVE_AUTH_DATA,
  SET_USER_NAME,
  REDIRECT_TO_AUTH,
  CANCEL_AUTH_REDIRECT,
  OFFER_AUTH_REDIRECT,
  SIGN_OUT,
} from 'constants/actionTypes';

const defaultState = {
  accessToken: '',
  tokenExpiresAt: null,
  userId: '',
  userName: '',
  isRedirecting: false,
  hasAuthOffer: false,
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
      };
    case OFFER_AUTH_REDIRECT:
      return {
        ...state,
        hasAuthOffer: true,
      };
    case CANCEL_AUTH_REDIRECT:
      return {
        ...state,
        hasAuthOffer: false,
      };
    case SIGN_OUT: // change to defaultState?
      return {
        accessToken: '',
        tokenExpiresAt: null,
        userId: '',
        userName: '',
        isRedirecting: false,
        hasAuthOffer: false,
      };
    default:
      return state;
  }
};

export default authReducer;

// export function accessToken(state = '', action) {
//   switch (action.type) {
//     case 'SAVE_ACCESS_TOKEN':
//       return action.accessToken;
//     case 'SIGN_OUT':
//       return '';
//     default:
//       return state;
//   }
// }

// export function tokenExpiry(state = null, action) {
//   switch (action.type) {
//     case 'SAVE_ACCESS_TOKEN':
//       return action.tokenExpiresAt;
//     case 'SIGN_OUT':
//       return null;
//     default:
//       return state;
//   }
// }

// export function userId(state = '', action) {
//   switch (action.type) {
//     case 'SET_USER_ID':
//       return action.userId;
//     case 'SIGN_OUT':
//       return '';
//     default:
//       return state;
//   }
// }

// export function userName(state = '', action) {
//   switch (action.type) {
//     case 'SET_USER_NAME':
//       return action.userName;
//     case 'SIGN_OUT':
//       return '';
//     default:
//       return state;
//   }
// }
