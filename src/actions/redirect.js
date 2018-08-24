import { tokenRequestURL } from 'config/common';

import {
  REDIRECT_TO_AUTH,
  REJECT_AUTH_OFFER,
  OFFER_AUTH_REDIRECT,
  // NO_VALID_TOKEN,
} from 'constants/actionTypes';

export const offerAuthRedirect = ({ hasDelay = false }) => ({
  type: OFFER_AUTH_REDIRECT,
  hasDelay,
});

// TODO: dispatch it where it is reasonable
// export const noValidToken = () => ({ type: NO_VALID_TOKEN });
export const rejectAuthOffer = () => ({ type: REJECT_AUTH_OFFER });

export const redirectToAuth = () => {
  window.location.assign(tokenRequestURL);
  return { type: REDIRECT_TO_AUTH };
};
