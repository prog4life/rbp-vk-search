import { combineReducers } from 'redux';
import {
  SEARCH_BY_ITEMS_REQUEST, SEARCH_BY_ITEMS_REQUEST_SUCCESS, SEARCH_BY_ITEMS_REQUEST_FAIL,
  SEARCH_BY_ITEMS_REQUEST_REFUSE, SEARCH_BY_ITEMS_START, SEARCH_BY_ITEMS_TERMINATE,
} from 'constants/actionTypes';
import { addIfNotExist, createReducer } from './reducerUtils';

// const initialState = {
//   byId: {},
//   pending: [],
//   failed: [],
//   errors: [
//     { id: jy54, code: 6, attempt: 2 ?, message: 'Description of error' },
//     ...
//   ],
// };

// contains pending and failed requests objects with ids as keys
const byId = createReducer({}, {
  [SEARCH_BY_ITEMS_REQUEST]: (state, { id, startTime }) => ({
    ...state,
    [id]: {
      id,
      attempt: state[id] ? (state[id].attempt + 1) : 1,
      startTime,
    },
  }),
  [SEARCH_BY_ITEMS_REQUEST_SUCCESS]: (state, { id }) => {
    const nextState = { ...state };
    delete nextState[id];
    return nextState;
  },
  [SEARCH_BY_ITEMS_START]: () => ({}),
  [SEARCH_BY_ITEMS_TERMINATE]: () => ({}), // NOTE: remove ???
});

const removeId = (state, action) => state.filter(id => action.id !== id);

// list of pending requests ids
const pending = createReducer([], {
  [SEARCH_BY_ITEMS_REQUEST]: (state, { id }) => addIfNotExist(state, id),
  [SEARCH_BY_ITEMS_REQUEST_SUCCESS]: removeId,
  [SEARCH_BY_ITEMS_REQUEST_FAIL]: removeId,
  [SEARCH_BY_ITEMS_START]: () => ([]),
  [SEARCH_BY_ITEMS_TERMINATE]: () => ([]), // NOTE: remove ???
});

// list of failed requests ids
const failed = createReducer([], {
  [SEARCH_BY_ITEMS_REQUEST]: removeId,
  [SEARCH_BY_ITEMS_REQUEST_SUCCESS]: removeId,
  [SEARCH_BY_ITEMS_REQUEST_FAIL]: (state, { id }) => addIfNotExist(state, id),
  [SEARCH_BY_ITEMS_START]: () => ([]),
  [SEARCH_BY_ITEMS_TERMINATE]: () => ([]), // NOTE: remove ???
});

const errors = createReducer([], { // TODO: { type, ...rest } -> { ...rest }
  [SEARCH_BY_ITEMS_REQUEST_FAIL]: (state, action) => (
    [...state, {
      code: action.code,
      id: action.id,
      message: action.message,
      callbackId: action.callbackId,
    }]
  ),
  [SEARCH_BY_ITEMS_REQUEST_REFUSE]: (state, { id, reason, callbackId }) => (
    [...state, { id, reason, callbackId }]
  ),
  [SEARCH_BY_ITEMS_START]: () => ([]),
});

// NOTE: is unnecessary, check for presence in entities
// const succeededIds = (state = [], action) => {
//   switch (action.type) {
//     case SEARCH_BY_ITEMS_REQUEST_SUCCESS:
//       return addIfNotExist(state, action.id);
//     case SEARCH_BY_ITEMS_START:
//     case SEARCH_BY_ITEMS_TERMINATE: // NOTE: remove ???
//       return [];
//     default:
//       return state;
//   }
// };

export default combineReducers({
  byId,
  pending,
  failed,
  errors,
});

export const getAllById = state => state.byId;
export const getPending = state => state.pending;
export const getFailed = state => state.failed;
