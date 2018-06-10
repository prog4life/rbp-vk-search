import {
  SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_FAIL,
} from 'constants/actionTypes';
import {
  getSearchIsActive, getRequestByOffset, getPendingList,
} from 'selectors';

const throwIfSearchIsOver = (isActive, offset) => {
  if (!isActive) {
    throw Error(`Needless request (offset: ${offset}), search is over already`);
  }
};

// if request with such offset was completed and removed from store already
const throwIfRequestIsExcess = (request, offset) => {
  if (!request) {
    throw new Error(`Request (offset: ${offset}) has been succeeded already`);
  }
};

// remove successful request obj from "requests"
export const onSuccess = ({ next, getState, offset }) => (response) => {
  const state = getState();
  const isActive = getSearchIsActive(state);
  const requestByOffset = getRequestByOffset(state, offset);

  throwIfSearchIsOver(isActive, offset);
  throwIfRequestIsExcess(requestByOffset, offset);
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
export const onFail = (next, getState, offset) => (e) => {
  const state = getState();
  const isActive = getSearchIsActive(state);
  const pending = getPendingList(state);

  // TODO: think over case when belated failed but pending repeated exists
  throwIfSearchIsOver(isActive, offset);
  // TODO: replace by specific memoized selector or check in reducer
  if (!pending.includes(offset)) {
    throw new Error(`Offset "${offset}" has been processed already`);
  }

  next({
    type: SEARCH_REQUEST_FAIL,
    offset,
  }); // TODO: refused: true flag for processed offsets

  throw new Error(`Request with ${offset} offset failed, ${e.message}`);
};
