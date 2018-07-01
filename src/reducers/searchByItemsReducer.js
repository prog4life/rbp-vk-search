import * as aT from 'constants/actionTypes';

const initialState = {
  isActive: false,
  isCompleted: false,
  itemIndex: 0,
  processedItems: [],
  error: null, // OR {}
  // IDEA:
  // mode: '', <- schema, target; unneeded ???
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case aT.SEARCH_BY_ITEMS_START:
      return {
        isActive: true,
        isCompleted: false,
        itemIndex: 0,
        processedItems: [],
        error: null,
      };
    case aT.SEARCH_BY_ITEMS_END:
      return {
        ...state,
        isActive: false,
        isCompleted: true,
      };
    case aT.SEARCH_BY_ITEMS_ERROR:
      return {
        ...state,
        isActive: false,
        error: { ...action.error },
      };
    case aT.SEARCH_BY_ITEMS_SET_INDEX:
      return {
        ...state,
        itemIndex: action.nextIndex,
      };
    case aT.SEARCH_BY_ITEMS_REQUEST_SUCCESS:
      return {
        ...state,
        processedItems: [...state.processedItems, action.id], // TODO: addIfNotExist
      };
    case aT.SEARCH_BY_ITEMS_TERMINATE: // TODO: return initialState ???
      return {
        isActive: false,
        isCompleted: false,
        itemIndex: 0,
        processedItems: [],
        error: null,
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

export default search;

export const isActive = state => state.isActive;
export const getIsCompleted = state => state.isCompleted;
export const getItemIndex = state => state.itemIndex;
export const getProcessedItems = state => state.processedItems;
export const getErrorCode = state => state.error && state.error.code;
