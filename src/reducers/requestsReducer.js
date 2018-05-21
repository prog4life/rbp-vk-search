import { maxAttempts } from 'config/common';
import { combineReducers } from 'redux';
import { addIfNotExist } from './reducerUtils';

// alternatively (if not passed from action): req.attempt + 1
// attempt: action.attempt,

// alternatively (if not passing from action): attempt: 1,
// attempt: action.attempt,

// const initialState = {
//   byId: {},
//   pendingIds: [],
//   failedIds: [],
// };

const byId = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_START':
    case 'REQUEST_FAIL': // NOTE: unnecessary ??? different attempts !!!
      // TODO: reject to add on maxAttempts
      return {
        ...state,
        [action.id]: {
          id: action.id,
          attempt: action.attempt,
          offset: action.offset,
          startTime: action.startTime,
        },
      };
    case 'REQUEST_SUCCESS': {
      const nextState = { ...state };
      delete nextState[action.id];
      return nextState;
    }
    case 'WALL_POSTS_SEARCH_START':
    case 'TERMINATE_SEARCH':
      return {};
    default:
      return state;
  }
};

const pendingIds = (state = [], action) => {
  switch (action.type) {
    case 'REQUEST_START':
      return addIfNotExist(state, action.id);
    case 'REQUEST_SUCCESS':
    case 'REQUEST_FAIL':
      return state.filter(id => action.id !== id);
    case 'WALL_POSTS_SEARCH_START':
    case 'TERMINATE_SEARCH':
      return [];
    default:
      return state;
  }
};

const failedIds = (state = [], action) => {
  switch (action.type) {
    case 'REQUEST_START':
    case 'REQUEST_SUCCESS':
      return state.filter(id => action.id !== id);
    case 'REQUEST_FAIL':
      return action.attempt === maxAttempts
        ? state
        : addIfNotExist(state, action.id);
    case 'WALL_POSTS_SEARCH_START':
    case 'TERMINATE_SEARCH':
      return [];
    default:
      return state;
  }
};

const completelyFailedIds = (state = [], action) => {
  switch (action.type) {
    case 'REQUEST_FAIL':
      return action.attempt === maxAttempts
        ? addIfNotExist(state, action.id)
        : state;
    case 'WALL_POSTS_SEARCH_START':
    case 'TERMINATE_SEARCH':
      return [];
    default:
      return state;
  }
};

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

export default combineReducers({
  byId,
  pendingIds,
  failedIds,
  completelyFailedIds,
});

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

// endTime: Date.now(), // TODO: remove or change to action.endTime later?
