import {
  REDIRECT_TO_AUTH,
  REJECT_AUTH_OFFER,
  OFFER_AUTH_REDIRECT,
  // AUTH_FAILED,
} from 'constants/actionTypes';

const initialState = {
  isRedirecting: false,
  hasAuthOffer: false,
  hasDelayedAuthOffer: true,
};

// Reducer for vk.com authentication redirection
// Related modals are displayed

const redirectReducer = (state = initialState, action) => {
  switch (action.type) {
    case REDIRECT_TO_AUTH:
      return {
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
    case REJECT_AUTH_OFFER:
      return {
        ...state,
        hasAuthOffer: false,
        hasDelayedAuthOffer: false,
      };
    // case AUTH_FAILED:
    //   return {
    //     ...state,
    //     isAuthFailed: true,
    //   };
    default:
      return state;
  }
};

export default redirectReducer;

export const getIsRedirecting = state => state.isRedirecting;
export const getAuthOffer = state => state.hasAuthOffer;
export const getDelayedAuthOffer = state => state.hasDelayedAuthOffer;
