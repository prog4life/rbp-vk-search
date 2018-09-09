import { REJECT_AUTH_OFFER, OFFER_AUTH } from 'constants/actionTypes';
import { AUTH_OFFER_DELAY } from 'constants/ui';

const initialState = {
  hasAuthOffer: true,
  // hasDelayedAuthOffer: true,
  authOfferDelay: AUTH_OFFER_DELAY,
};

// Reducer for vk.com authentication redirection
// Related modals are displayed

const redirectReducer = (state = initialState, action) => {
  switch (action.type) {
    case OFFER_AUTH: // TODO: rename to AUTH_REQUIRED or NOT_AUTHENTICATED
      return {
        hasAuthOffer: true,
        // hasDelayedAuthOffer: action.hasDelay,
        authOfferDelay: action.hasDelay ? AUTH_OFFER_DELAY : 0,
      };
    case REJECT_AUTH_OFFER:
      return {
        hasAuthOffer: false,
        // hasDelayedAuthOffer: false,
        authOfferDelay: 0, // next time without delay
      };
    default:
      return state;
  }
};

export default redirectReducer;

// export const getDelayedAuthOffer = state => state.hasDelayedAuthOffer;
export const hasAuthOffer = state => state.hasAuthOffer;
export const getAuthOfferDelay = state => state.authOfferDelay;
