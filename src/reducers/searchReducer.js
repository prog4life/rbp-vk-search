import {
  SEARCH_START, SEARCH_END, SEARCH_SET_OFFSET, TERMINATE_SEARCH,
  SEARCH_REQUEST, SEARCH_REQUEST_SUCCESS, SEARCH_REQUEST_FAIL,
} from 'constants/actionTypes';
import requests, {
  getAllByOffset, getPending, getFailed,
} from './requestsReducer';

const initialState = {
  isActive: false,
  isCompleted: false,
  offset: 0,
  processed: 0,
  // TODO: resolve case with count: 0
  total: null, // equivalent of "count" field in vk API response
  requests: {
    byOffset: {},
    pending: [],
    failed: [],
  },
  // IDEA:
  // searchedItems: '', <- itemsName
  // error: '',
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_START:
      return {
        isActive: true,
        isCompleted: false,
        offset: 0,
        processed: 0,
        total: null,
        requests: requests(state.requests, action),
      };
    case SEARCH_END:
      return {
        ...state,
        isActive: false,
        isCompleted: true,
        // offset: 0, // TODO: use it
        // requests: requests(state, action), // ???
      };
    case SEARCH_SET_OFFSET:
      return {
        ...state,
        offset: action.offset,
      };
    case SEARCH_REQUEST:
    case SEARCH_REQUEST_FAIL:
      return {
        ...state,
        requests: requests(state.requests, action),
      };
    case SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        total: action.total !== null ? action.total : state.total,
        processed: action.amount !== null
          ? state.processed + action.amount
          : state.processed,
        requests: requests(state.requests, action),
      };
    // case 'SEARCH_UPDATE':
    //   return {
    //     ...state,
    //     total: action.total !== null ? action.total : state.total,
    //     processed: action.processed || state.processed,
    //   };
    case TERMINATE_SEARCH:
      return {
        isActive: false,
        isCompleted: false,
        offset: 0,
        processed: 0,
        total: null,
        requests: requests(state.requests, action),
      };
    default:
      return state;
  }
};

export default search;

export const getTotal = state => state.total;
export const getOffset = state => state.offset;
export const getProcessed = state => state.processed;
export const getIsActive = state => state.isActive;
export const getIsCompleted = state => state.isCompleted;

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
