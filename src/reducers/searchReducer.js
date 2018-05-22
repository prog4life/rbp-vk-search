import { SEARCH_SET_OFFSET } from 'middleware/searchProcessor';
import requests from './requestsReducer';

const defaultSearchState = {
  isActive: false,
  offset: 0,
  processed: 0,
  // progress: 0,
  // total: undefined,
  requests: {},
};

const search = (state = defaultSearchState, action) => {
  switch (action.type) {
    case 'WALL_POSTS_SEARCH_START':
      return {
        isActive: true,
        offset: 0,
        processed: 0,
        // progress: 0,
        requests: requests(state.requests, action),
      };
    case 'WALL_POSTS_SEARCH_END':
      return {
        ...state,
        isActive: false,
        // requests: requests(state, action), // ???
      };
    case SEARCH_SET_OFFSET:
      return {
        ...state,
        offset: action.offset,
      };
    // case 'SET_SEARCH_INTERVAL_ID':
    //   return {
    //     ...state,
    //     intervalId: action.intervalId
    //   };
    case 'REQUEST_START':
    case 'REQUEST_SUCCESS':
    case 'REQUEST_FAIL':
      return {
        ...state,
        requests: requests(state.requests, action),
      };
    case 'SEARCH_UPDATE':
      return {
        ...state,
        total: action.total || state.total, // equal to response.count
        processed: action.processed || state.processed,
        // progress: action.progress,
      };
    case 'TERMINATE_SEARCH':
      return {
        isActive: false,
        offset: 0,
        processed: 0,
        // progress: 0,
        requests: requests(state.requests, action),
      };
    default:
      return state;
  }
};

export default search;

export const getTotal = state => state.total;
export const getProcessed = state => state.processed;
export const getIsActive = state => state.isActive;

// PREV version
// export default function search(state = defaultSearchState, action) {
//   switch (action.type) {
//     // case 'PREPARE_SEARCH':
//     //   return {
//     //     ...state,
//     //     isActive: true
//     //   };
//     case 'WALL_POSTS_SEARCH_START':
//       return {
//         isActive: true,
//         processed: 0
//         // progress: 0
//       };
//     case 'WALL_POSTS_SEARCH_END':
//       // TODO: clean up search state values
//       return {
//         ...state,
//         isActive: false
//       };
//     // NOTE: filtered in Redux logger config
//     case 'SEARCH_UPDATE':
//       return {
//         ...state,
//         total: action.total || state.total,
//         processed: action.processed || state.processed
//       };
//     case 'TERMINATE_SEARCH':
//       // TODO: clean up search state values
//       return {
//         isActive: false,
//         processed: 0
//         // progress: 0
//       };
//     default:
//       return state;
//   }
// }
