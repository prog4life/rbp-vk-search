import {
  SEARCH_BY_ITEMS_REQUEST_SUCCESS, SEARCH_BY_ITEMS_REQUEST_FAIL,
  SEARCH_BY_ITEMS_REQUEST_REFUSE, SEARCH_BY_ITEMS_ERROR,
} from 'constants/actionTypes';
import { AUTH_FAILED } from 'constants/api'; // TODO: pass from <- mw <- options ?
import {
  isSearchByItemsActive, getRequestById, getSearchByItemsPending,
} from 'selectors';

const refuseSearchRequest = (next, reason, { itemId, callbackId = null }) => {
  let msg = 'Request was refused by unknown reason';

  switch (reason) {
    case 'request-succeeded':
      msg = `Request with id: ${itemId} has been succeeded already`;
      break;
    case 'request-processed':
      msg = `Request with id: ${itemId} has been processed already`;
      break;
    case 'search-is-over':
      msg = `Needless request (id: ${itemId}), search is over already`;
      break;
    default:
  }
  next({
    type: SEARCH_BY_ITEMS_REQUEST_REFUSE,
    id: itemId,
    reason: msg,
    callbackId,
  });
  const error = new Error(msg);

  error.isRefuse = true;
  throw error;
};

// remove successful request obj from "requests"
export const onSuccess = ({ next, getState, itemId }) => (response) => {
  const state = getState();
  const isActive = isSearchByItemsActive(state);
  const request = getRequestById(state, itemId);

  if (!isActive) {
    refuseSearchRequest(next, 'search-is-over', { itemId });
  }
  // if another request with such id was completed and therefore removed
  // from store already
  if (!request) {
    refuseSearchRequest(next, 'request-succeeded', { itemId });
  }
  next({
    type: SEARCH_BY_ITEMS_REQUEST_SUCCESS,
    id: itemId,
    // response,
  });

  return response;
};

// add failed request obj to "requests"
export const onFail = ({ next, getState, itemId }) => (error) => {
  const state = getState();
  const isActive = isSearchByItemsActive(state);
  const pending = getSearchByItemsPending(state);

  // NOTE: in case when prev attempt request will fail but next
  // attempt pending exists: if pending succeeds later - it will rewrite failed
  if (!isActive) {
    refuseSearchRequest(next, 'search-is-over', { itemId });
  }
  const { code = null, message = null, requestParams } = error;
  const callbackId = Array.isArray(requestParams) // OPTIONAL
    ? requestParams.find(param => param.key === 'callback').value
    : null;

  // if another request with such offset has succeeded or failed earlier
  if (!pending.includes(itemId)) {
    refuseSearchRequest(next, 'request-processed', { itemId, callbackId });
  }

  if (code === AUTH_FAILED) { // invalid access_token
    next({
      type: SEARCH_BY_ITEMS_ERROR,
      error: { code, message, requestParams },
    });
    throw error;
  }
  next({
    type: SEARCH_BY_ITEMS_REQUEST_FAIL,
    id: itemId,
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
