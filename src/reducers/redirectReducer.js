import {
  REDIRECT_TO_AUTH,
  REJECT_AUTH_OFFER,
  OFFER_AUTH,
  // AUTH_FAILED,
} from 'constants/actionTypes';
import { AUTH_OFFER_DELAY } from 'constants/ui';

const initialState = {
  isRedirecting: false,
  hasAuthOffer: true,
  // hasDelayedAuthOffer: true,
  authOfferDelay: AUTH_OFFER_DELAY,
};

// Reducer for vk.com authentication redirection
// Related modals are displayed

const redirectReducer = (state = initialState, action) => {
  switch (action.type) {
    case REDIRECT_TO_AUTH:
      return {
        isRedirecting: true,
        hasAuthOffer: false,
        // hasDelayedAuthOffer: false,
        authOfferDelay: AUTH_OFFER_DELAY,
      };
    case OFFER_AUTH: // TODO: rename to AUTH_REQUIRED
      return {
        ...state,
        hasAuthOffer: true,
        // hasDelayedAuthOffer: action.hasDelay,
        authOfferDelay: action.hasDelay ? AUTH_OFFER_DELAY : 0,
      };
    case REJECT_AUTH_OFFER:
      return {
        ...state,
        hasAuthOffer: false,
        // hasDelayedAuthOffer: false,
        authOfferDelay: 0, // next time without delay
      };
    // case AUTH_FAILED:
    //   return {
    //     ...state,
    //  };
    default:
      return state;
  }
};

export default redirectReducer;

export const getIsRedirecting = state => state.isRedirecting;
// export const getDelayedAuthOffer = state => state.hasDelayedAuthOffer;
export const hasAuthOffer = state => state.hasAuthOffer;
export const getAuthOfferDelay = state => state.authOfferDelay;
