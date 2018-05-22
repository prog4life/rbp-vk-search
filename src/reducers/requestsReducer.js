import { combineReducers } from 'redux';
import {
  REQUEST_START, REQUEST_SUCCESS, REQUEST_FAIL,
  WALL_POSTS_SEARCH_START, TERMINATE_SEARCH,
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

// const byId = (state = {}, { type, id, offset, startTime }) => {
//   switch (type) {
//     case REQUEST_START:
//       return {
//         ...state,
//         [id]: {
//           id,
//           attempt: state[id] ? (state[id].attempt + 1) : 1,
//           offset,
//           startTime,
//         },
//       };
//     case REQUEST_SUCCESS: {
//       const nextState = { ...state };
//       delete nextState[id];
//       return nextState;
//     }
//     // case REQUEST_FAIL: // NOTE: unnecessary
//     //   return {
//     //     ...state,
//     //     [id]: {
//     //       id,
//     //       attempt: state[id].attempt,
//     //       offset,
//     //       startTime,
//     //     },
//     //   };
//     case WALL_POSTS_SEARCH_START:
//     case TERMINATE_SEARCH: // NOTE: remove ???
//       return {};
//     default:
//       return state;
//   }
// };

const byId = createReducer({}, {
  [REQUEST_START]: (state, { id, offset, startTime }) => ({
    ...state,
    [id]: {
      id,
      attempt: state[id] ? (state[id].attempt + 1) : 1,
      offset,
      startTime,
    },
  }),
  [REQUEST_SUCCESS]: (state, { id }) => {
    const nextState = { ...state };
    delete nextState[id];
    return nextState;
  },
  [WALL_POSTS_SEARCH_START]: () => ({}),
  [TERMINATE_SEARCH]: () => ({}), // NOTE: remove ???
});

// const pendingIds = (state = [], action) => {
//   switch (action.type) {
//     case REQUEST_START:
//       return addIfNotExist(state, action.id);
//     case REQUEST_SUCCESS:
//     case REQUEST_FAIL:
//       return state.filter(id => action.id !== id);
//     case WALL_POSTS_SEARCH_START:
//     case TERMINATE_SEARCH: // NOTE: remove ???
//       return [];
//     default:
//       return state;
//   }
// };

const removeId = (state, action) => state.filter(id => action.id !== id);

const pendingIds = createReducer([], {
  [REQUEST_START]: (state, { id }) => addIfNotExist(state, id),
  [REQUEST_SUCCESS]: removeId,
  [REQUEST_FAIL]: removeId,
  [WALL_POSTS_SEARCH_START]: () => ([]),
  [TERMINATE_SEARCH]: () => ([]), // NOTE: remove ???
});

const failedIds = (state = [], action) => {
  switch (action.type) {
    case REQUEST_START:
    case REQUEST_SUCCESS:
      return state.filter(id => action.id !== id);
    case REQUEST_FAIL:
      return addIfNotExist(state, action.id);
    case WALL_POSTS_SEARCH_START:
    case TERMINATE_SEARCH: // NOTE: remove ???
      return [];
    default:
      return state;
  }
};

const succeededIds = (state = [], action) => {
  switch (action.type) {
    case REQUEST_SUCCESS:
      return addIfNotExist(state, action.id);
    case WALL_POSTS_SEARCH_START:
    case TERMINATE_SEARCH: // NOTE: remove ???
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  pendingIds,
  failedIds,
  succeededIds,
});

// endTime: Date.now(), // TODO: remove or change to action.endTime later?

// const createIdsReducer = (typeOfRequests) => {
//   const idsReducer = (state = [], action) => {
//     switch (action.type) {
//       case 'REQUEST_START':
//         return typeOfRequests === 'pending'
//           ? addIfNotExist(state, action.id)
//           : state.filter(id => action.id !== id);
//       case 'REQUEST_SUCCESS':
//         return state.filter(id => action.id !== id);
//       case 'REQUEST_FAIL':
//         return typeOfRequests === 'pending'
//           ? state.filter(id => action.id !== id)
//           : addIfNotExist(state, action.id);
//       case 'WALL_POSTS_SEARCH_START':
//       case 'TERMINATE_SEARCH':
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
//     case 'REQUEST_START':
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
//     case 'REQUEST_SUCCESS': {
//       const { [action.id]: successful, ...rest } = state;
//       return { ...rest };
//     }
//     case 'REQUEST_FAIL':
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
//     case 'WALL_POSTS_SEARCH_START':
//     case 'TERMINATE_SEARCH':
//       return {};
//     default:
//       return state;
//   }
// }
