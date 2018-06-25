import {
  SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_FAIL, SEARCH_REQUEST_REFUSE, SEARCH_ERROR,
} from 'constants/actionTypes';
import { AUTH_FAILED } from 'constants/api'; // TODO: pass from <- mw <- options ?
import {
  getSearchIsActive, getRequestByOffset, getPendingList,
} from 'selectors';

const refuseSearchRequest = (next, reason, { offset, callbackId = null }) => {
  let msg = 'Request was refused by unknown reason';

  switch (reason) {
    case 'request-succeeded':
      msg = `Request with ${offset} offset has been succeeded already`;
      break;
    case 'request-processed':
      msg = `Offset ${offset} has been processed already`;
      break;
    case 'search-is-over':
      msg = `Needless request (offset: ${offset}), search is over already`;
      break;
    default:
  }
  next({
    type: SEARCH_REQUEST_REFUSE,
    offset,
    reason: msg,
    callbackId,
  });
  const error = new Error(msg);

  error.isRefuse = true;
  throw error;
};

// remove successful request obj from "requests"
export const onSuccess = ({ next, getState, offset }) => (response) => {
  const state = getState();
  const isActive = getSearchIsActive(state);
  const requestByOffset = getRequestByOffset(state, offset);

  if (!isActive) {
    refuseSearchRequest(next, 'search-is-over', { offset });
  }
  // if another request with such offset was completed and therefore removed
  // from store already
  if (!requestByOffset) {
    refuseSearchRequest(next, 'request-succeeded', { offset });
  }
  next({
    type: SEARCH_REQUEST_SUCCESS,
    offset,
    total: response.count || null,
    // NOTE: OR if can't get items length -> pass count (offsetModifier) ?
    amount: response.items ? response.items.length : null,
  });

  return response;
};

// add failed request obj to "requests"
export const onFail = ({ next, getState, offset }) => (error) => {
  const state = getState();
  const isActive = getSearchIsActive(state);
  const pending = getPendingList(state);

  // NOTE: in case when prev attempt request will fail but next
  // attempt pending exists: if pending succeeds later - it will rewrite failed
  if (!isActive) {
    refuseSearchRequest(next, 'search-is-over', { offset });
  }
  const { code = null, message = null, requestParams } = error;
  const callbackId = Array.isArray(requestParams) // OPTIONAL
    ? requestParams.find(param => param.key === 'callback').value
    : null;

  // if another request with such offset has succeeded or failed earlier
  if (!pending.includes(offset)) {
    refuseSearchRequest(next, 'request-processed', { offset, callbackId });
  }

  if (code === AUTH_FAILED) { // invalid access_token
    next({ type: SEARCH_ERROR, error: { code, message, requestParams } });
    throw error;
  }
  next({
    type: SEARCH_REQUEST_FAIL,
    offset,
    code,
    message,
    callbackId,
  });
  throw error; // maybe add offset prop
};

// ----------------- PRIOR HELPERS -------------------------------------------
// const denyIfSearchIsOver = (isActive, next, offset) => {
//   if (!isActive) {
//     const msg = `Needless request (offset: ${offset}), search is over already`;
//
//     next({
//       type: SEARCH_REQUEST_REFUSE,
//       reason: msg,
//     });
//     const error = new Error(msg);
//
//     error.isRefuse = true;
//     throw error;
//   }
// };

// if another request with such offset was completed and therefore removed
// from store already
// const throwIfRequestIsExcess = (request, offset) => {
//   if (!request) {
//     throw new Error(`Request (offset: ${offset}) has been succeeded already`);
//   }
// };

// if another request with such offset has succeeded or failed earlier
// const throwIfOffsetIsProcessed = (pendingRequests, offset) => {
//   if (!pendingRequests.includes(offset)) {
//     throw new Error(`Offset "${offset}" has been processed already`);
//   }
// };
