import * as aT from 'constants/actionTypes';
import requests, {
  getAllByOffset, getPending, getFailed,
} from './requestsReducer';

const initialState = {
  isActive: false,
  isCompleted: false,
  error: null,
  offset: 0,
  processed: 0, // TODO: add -Items
  // TODO: add -Items:
  // TODO: resolve case with count: 0
  total: null, // equivalent of "count" field in vk API response
  requests: {
    byOffset: {},
    pending: [],
    failed: [],
  },
  // IDEA:
  // mode: '', <- schema, target; unneeded ???
  // error: {},
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case aT.SEARCH_START:
      return {
        isActive: true,
        isCompleted: false,
        error: null,
        offset: 0,
        processed: 0,
        total: null,
        requests: requests(state.requests, action),
      };
    case aT.SEARCH_END:
      return {
        ...state,
        isActive: false,
        isCompleted: true,
        // offset: 0, // TODO: use it
        // requests: requests(state, action), // ???
      };
    case aT.SEARCH_ERROR:
      return {
        ...state,
        isActive: false,
        error: { ...action.error },
      };
    case aT.SEARCH_SET_OFFSET:
      return {
        ...state,
        offset: action.offset,
      };
    case aT.SEARCH_REQUEST:
    case aT.SEARCH_REQUEST_FAIL:
    case aT.SEARCH_REQUEST_REFUSE:
      return {
        ...state,
        requests: requests(state.requests, action),
      };
    case aT.SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        total: action.total !== null ? action.total : state.total,
        processed: action.amount !== null
          ? state.processed + action.amount
          : state.processed,
        requests: requests(state.requests, action),
      };
    // case aT.SEARCH_UPDATE:
    //   return {
    //     ...state,
    //     total: action.total !== null ? action.total : state.total,
    //     processed: action.processed || state.processed,
    //   };
    case aT.TERMINATE_SEARCH: // TODO: return initialState ???
      return {
        isActive: false,
        isCompleted: false,
        error: null,
        offset: 0,
        processed: 0,
        total: null,
        requests: requests(state.requests, action),
      };
    default:
      return state;
  }
};

// TODO:
// status: {
//   isActive,
//   isCompleted,
// }
// progress: {
//   total,
//   processed,
// },
// error: {} // maybe add it to status
// offset,
// requests,

export default search;

export const getTotal = state => state.total;
export const getOffset = state => state.offset;
export const getProcessed = state => state.processed;
export const getIsActive = state => state.isActive;
export const getIsCompleted = state => state.isCompleted;
export const getErrorCode = state => state.error && state.error.code;
// from "requests" state slice
export const getRequestsByOffset = state => getAllByOffset(state.requests);
export const getPendingList = state => getPending(state.requests);
export const getFailedList = state => getFailed(state.requests);

// PREV version
// export default function search(state = initialState, action) {
//   switch (action.type) {
//     // case 'PREPARE_SEARCH':
//     //   return {
//     //     ...state,
//     //     isActive: true
//     //   };
//     case SEARCH_START:
//       return {
//         isActive: true,
//         processed: 0
//         // progress: 0
//       };
//     case SEARCH_END:
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
//     case TERMINATE_SEARCH:
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
