import { redirectToTokenRequestUrl } from 'utils/accessToken';

import {
  REDIRECT_TO_AUTH,
  REJECT_AUTH_REDIRECT,
  OFFER_AUTH_REDIRECT,
} from 'constants/actionTypes';

export const offerAuthRedirect = ({ hasDelay = false }) => ({
  type: OFFER_AUTH_REDIRECT,
  hasDelay,
});

export const rejectAuthRedirect = () => ({ type: REJECT_AUTH_REDIRECT });

export const redirectToAuth = () => {
  redirectToTokenRequestUrl();
  return { type: REDIRECT_TO_AUTH };
};
