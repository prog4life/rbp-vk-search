import {
  SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_FAIL, SEARCH_REQUEST_REFUSE, SEARCH_ERROR,
} from 'constants/actionTypes';
import { AUTH_FAILED } from 'constants/api'; // TODO: pass from <- mw <- options ?
import {
  getSearchIsActive, getRequestByOffset, getPendingList,
} from 'selectors';

// import shortId from 'shortid';

const refuseSearchRequest = (next, reason, { offset, callbackId = null }) => {
  // const measureId = shortId.generate();
  // console.time(`--- REFUSE ${measureId} ---`);
  const errorMessages = {
    'request-succeeded': `Request with ${offset} offset has been succeeded already`,
    'offset-processed': `Offset ${offset} has been processed already`,
    'search-is-over': `Needless request (offset: ${offset}), search is over already`,
  };
  const msg = errorMessages[reason];

  next({
    type: SEARCH_REQUEST_REFUSE,
    offset,
    reason: msg,
    callbackId,
  });
  const error = new Error(msg);

  error.isRefuse = true;
  // console.timeEnd(`--- REFUSE ${measureId} ---`);
  throw error;
};

// remove successful request obj from "requests"
export const onSuccess = ({ next, getState, offset }) => (response) => {
  // const measureId = shortId.generate();
  // console.time(`--- ON SUCCESS SELECTORS ${measureId} ---`);
  const state = getState();
  const isActive = getSearchIsActive(state);
  const requestByOffset = getRequestByOffset(state, offset);
  // console.timeEnd(`--- ON SUCCESS SELECTORS ${measureId} ---`);
  // console.time(`--- ON SUCCESS ${measureId} ---`);

  if (!isActive) {
    // console.timeEnd(`--- ON SUCCESS ${measureId} ---`);
    refuseSearchRequest(next, 'search-is-over', { offset });
  }
  // if another request with such offset was completed and therefore removed
  // from store already
  if (!requestByOffset) {
    // console.timeEnd(`--- ON SUCCESS ${measureId} ---`);
    refuseSearchRequest(next, 'request-succeeded', { offset });
  }
  next({
    type: SEARCH_REQUEST_SUCCESS,
    offset,
    total: response.count || null,
    // NOTE: or if can't get items length - use count (offsetModifier) ?
    amount: response.items ? response.items.length : null,
  });
  // console.timeEnd(`--- ON SUCCESS ${measureId} ---`);
  return response;
};

// add failed request obj to "requests"
export const onFail = ({ next, getState, offset }) => (error) => {
  // const measureId = shortId.generate();
  // console.time(`--- ON FAIL SELECTORS ${measureId} ---`);
  const state = getState();
  const isActive = getSearchIsActive(state);
  const pending = getPendingList(state);
  // console.timeEnd(`--- ON FAIL SELECTORS ${measureId} ---`);
  // console.time(`--- ON FAIL ${measureId} ---`);

  // NOTE: in case when prev attempt request will fail but next
  // attempt pending exists: if pending succeeds later - it will rewrite failed
  if (!isActive) {
    // console.timeEnd(`--- ON FAIL ${measureId} ---`);
    refuseSearchRequest(next, 'search-is-over', { offset });
  }
  const { code = null, message = '', params } = error;
  const callbackId = Array.isArray(params) // OPTIONAL
    ? params.find(param => param.key === 'callback').value
    : null;

  // if another request with such offset has succeeded or failed earlier
  if (!pending.includes(offset)) {
    // console.timeEnd(`--- ON FAIL ${measureId} ---`);
    refuseSearchRequest(next, 'offset-processed', { offset, callbackId });
  }

  if (code === AUTH_FAILED) { // invalid access_token
    next({ type: SEARCH_ERROR, error: { code, message, params } });
    // console.timeEnd(`--- ON FAIL ${measureId} ---`);
    throw error;
  }
  next({
    type: SEARCH_REQUEST_FAIL,
    offset,
    code,
    message,
    callbackId,
  });
  // console.timeEnd(`--- ON FAIL ${measureId} ---`);
  throw error;
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
