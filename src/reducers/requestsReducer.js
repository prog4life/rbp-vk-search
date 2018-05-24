import { combineReducers } from 'redux';
import {
  SEARCH_REQUEST, SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_FAIL,
  SEARCH_START, TERMINATE_SEARCH,
} from 'constants/actionTypes';
import { addIfNotExist, createReducer } from './reducerUtils';

// alternatively (if not passed from action): req.attempt + 1
// attempt: action.attempt,

// alternatively (if not passing from action): attempt: 1,
// attempt: action.attempt,

// const initialState = {
//   byId: {},
//   pendingIds: [],
//   failedIds: [],
// };

// TODO: change id to offset -> requestsByOffset

const byId = createReducer({}, {
  [SEARCH_REQUEST]: (state, { id, offset, startTime }) => ({
    ...state,
    [id]: {
      id,
      attempt: state[id] ? (state[id].attempt + 1) : 1,
      offset,
      startTime,
    },
  }),
  [SEARCH_REQUEST_SUCCESS]: (state, { id }) => {
    const nextState = { ...state };
    delete nextState[id];
    return nextState;
  },
  [SEARCH_START]: () => ({}),
  [TERMINATE_SEARCH]: () => ({}), // NOTE: remove ???
});

const removeId = (state, action) => state.filter(id => action.id !== id);

const pendingIds = createReducer([], {
  [SEARCH_REQUEST]: (state, { id }) => addIfNotExist(state, id),
  [SEARCH_REQUEST_SUCCESS]: removeId,
  [SEARCH_REQUEST_FAIL]: removeId,
  [SEARCH_START]: () => ([]),
  [TERMINATE_SEARCH]: () => ([]), // NOTE: remove ???
});

const failedIds = createReducer([], {
  [SEARCH_REQUEST]: removeId,
  [SEARCH_REQUEST_SUCCESS]: removeId,
  [SEARCH_REQUEST_FAIL]: (state, { id }) => addIfNotExist(state, id),
  [SEARCH_START]: () => ([]),
  [TERMINATE_SEARCH]: () => ([]), // NOTE: remove ???
});

// NOTE: is unnecessary, check for presence in entities
// const succeededIds = (state = [], action) => {
//   switch (action.type) {
//     case SEARCH_REQUEST_SUCCESS:
//       return addIfNotExist(state, action.id);
//     case SEARCH_START:
//     case TERMINATE_SEARCH: // NOTE: remove ???
//       return [];
//     default:
//       return state;
//   }
// };

export default combineReducers({
  byId,
  pendingIds,
  failedIds,
  // succeededIds,
});

export const getAllById = state => state.byId;
export const getPendingIds = state => state.pendingIds;
export const getFailedIds = state => state.failedIds;

// const byId = (state = {}, { type, id, offset, startTime }) => {
//   switch (type) {
//     case SEARCH_REQUEST:
//       return {
//         ...state,
//         [id]: {
//           id,
//           attempt: state[id] ? (state[id].attempt + 1) : 1,
//           offset,
//           startTime,
//         },
//       };
//     case SEARCH_REQUEST_SUCCESS: {
//       const nextState = { ...state };
//       delete nextState[id];
//       return nextState;
//     }
//     // case SEARCH_REQUEST_FAIL: // NOTE: unnecessary
//     //   return {
//     //     ...state,
//     //     [id]: {
//     //       id,
//     //       attempt: state[id].attempt,
//     //       offset,
//     //       startTime,
//     //     },
//     //   };
//     case SEARCH_START:
//     case TERMINATE_SEARCH: // NOTE: remove ???
//       return {};
//     default:
//       return state;
//   }
// };

// const pendingIds = (state = [], action) => {
//   switch (action.type) {
//     case SEARCH_REQUEST:
//       return addIfNotExist(state, action.id);
//     case SEARCH_REQUEST_SUCCESS:
//     case SEARCH_REQUEST_FAIL:
//       return state.filter(id => action.id !== id);
//     case SEARCH_START:
//     case TERMINATE_SEARCH: // NOTE: remove ???
//       return [];
//     default:
//       return state;
//   }
// };

// const failedIds = (state = [], action) => {
//   switch (action.type) {
//     case SEARCH_REQUEST:
//     case SEARCH_REQUEST_SUCCESS:
//       return state.filter(id => action.id !== id);
//     case SEARCH_REQUEST_FAIL:
//       return addIfNotExist(state, action.id);
//     case SEARCH_START:
//     case TERMINATE_SEARCH: // NOTE: remove ???
//       return [];
//     default:
//       return state;
//   }
// };

// ----------------------------------------------------------------------------

// endTime: Date.now(), // TODO: remove or change to action.endTime later?

// const createIdsReducer = (typeOfRequests) => {
//   const idsReducer = (state = [], action) => {
//     switch (action.type) {
//       case 'SEARCH_REQUEST':
//         return typeOfRequests === 'pending'
//           ? addIfNotExist(state, action.id)
//           : state.filter(id => action.id !== id);
//       case 'SEARCH_REQUEST_SUCCESS':
//         return state.filter(id => action.id !== id);
//       case 'SEARCH_REQUEST_FAIL':
//         return typeOfRequests === 'pending'
//           ? state.filter(id => action.id !== id)
//           : addIfNotExist(state, action.id);
//       case SEARCH_START:
//       case TERMINATE_SEARCH:
//         return [];
//       default:
//         return state;
//     }
//   };
//   return idsReducer;
// };

// ====================== OLD PART ============================================

// export default function requests(state = initialState, action) {
//   switch (action.type) {
//     case 'SEARCH_REQUEST':
//       return {
//         ...state,
//         [action.id]: {
//           id: action.id,
//           attempt: action.attempt,
//           isPending: true,
//           // isDone: false,
//           offset: action.offset,
//           startTime: action.startTime,
//         },
//       };
//     case 'SEARCH_REQUEST_SUCCESS': {
//       const { [action.id]: successful, ...rest } = state;
//       return { ...rest };
//     }
//     case 'SEARCH_REQUEST_FAIL':
//       return {
//         ...state,
//         [action.id]: {
//           id: action.id,
//           attempt: action.attempt,
//           isPending: false,
//           // isDone: false,
//           offset: action.offset,
//           startTime: action.startTime,
//         },
//       };
//     case SEARCH_START:
//     case TERMINATE_SEARCH:
//       return {};
//     default:
//       return state;
//   }
// }
