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
//   byOffset: {},
//   pendingList: [],
//   failedList: [],
// };

// TODO: change id to offset -> requestsByOffset

const byOffset = createReducer({}, {
  [SEARCH_REQUEST]: (state, { offset, startTime }) => ({
    ...state,
    [offset]: {
      offset,
      attempt: state[offset] ? (state[offset].attempt + 1) : 1,
      startTime,
    },
  }),
  [SEARCH_REQUEST_SUCCESS]: (state, { offset }) => {
    const nextState = { ...state };
    delete nextState[offset];
    return nextState;
  },
  [SEARCH_START]: () => ({}),
  [TERMINATE_SEARCH]: () => ({}), // NOTE: remove ???
});

const removeOffset = (state, action) => state.filter(o => action.offset !== o);

const pending = createReducer([], {
  [SEARCH_REQUEST]: (state, { offset }) => addIfNotExist(state, offset),
  [SEARCH_REQUEST_SUCCESS]: removeOffset,
  [SEARCH_REQUEST_FAIL]: removeOffset,
  [SEARCH_START]: () => ([]),
  [TERMINATE_SEARCH]: () => ([]), // NOTE: remove ???
});

const failed = createReducer([], {
  [SEARCH_REQUEST]: removeOffset,
  [SEARCH_REQUEST_SUCCESS]: removeOffset,
  [SEARCH_REQUEST_FAIL]: (state, { offset }) => addIfNotExist(state, offset),
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
  byOffset,
  pending,
  failed,
});

export const getAllByOffset = state => state.byOffset;
export const getPending = state => state.pending;
export const getFailed = state => state.failed;

// const byOffset = (state = {}, { type, id, offset, startTime }) => {
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

// const pendingList = (state = [], action) => {
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

// const failedList = (state = [], action) => {
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
