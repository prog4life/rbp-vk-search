import { redirectToTokenRequestUrl } from 'utils/accessToken';

import {
  REDIRECT_TO_AUTH,
  REJECT_AUTH_OFFER,
  OFFER_AUTH_REDIRECT,
} from 'constants/actionTypes';

export const offerAuthRedirect = ({ hasDelay = false }) => ({
  type: OFFER_AUTH_REDIRECT,
  hasDelay,
});

export const rejectAuthOffer = () => ({ type: REJECT_AUTH_OFFER });

export const redirectToAuth = () => {
  redirectToTokenRequestUrl();
  return { type: REDIRECT_TO_AUTH };
};
