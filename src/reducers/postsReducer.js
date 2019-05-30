import { combineReducers } from 'redux';
import {
  POSTS_RECEIVED, START_WALL_POSTS_SEARCH, SET_POSTS_SORT_ORDER, SET_POSTS_FILTER_TEXT,
} from 'constants/actionTypes.js';
import { createReducer, makeUnion } from './reducerUtils';

// export default function posts(state = {}, action) {
//   switch (action.type) {
//     case ADD_RESULTS: {
//       const isEmpty = Object.keys(action.results).length < 1;
//       return isEmpty ? state : {
//         ...state,
//         ...action.results,
//       };
//     }
//     case START_WALL_POSTS_SEARCH:
//       return {};
//     default:
//       return state;
//   }
// }

// TODO: cut excess results at SEARCH_END
// TODO: add flag to check to show or not intermediate results during search

// Reducer for found by search posts at wall

const byId = createReducer(null, {
  [POSTS_RECEIVED]: (state, action) => (
    action.ids.length > 0
      ? { ...state, ...action.itemsById }
      : state
  ),
  [START_WALL_POSTS_SEARCH]: () => ({}),
});

const ids = createReducer(null, {
  [POSTS_RECEIVED]: (state, action) => (
    action.ids.length > 0
      ? makeUnion(state, action.ids)
      : state
  ),
  [START_WALL_POSTS_SEARCH]: () => ([]),
});

const limit = createReducer(null, {
  [START_WALL_POSTS_SEARCH]: (state, action) => action.limit,
});

const sortOrder = createReducer('descend', {
  [SET_POSTS_SORT_ORDER]: (state, action) => action.order,
});

const filterText = createReducer('', {
  [SET_POSTS_FILTER_TEXT]: (state, action) => action.filterText,
});

export default combineReducers({
  byId,
  ids,
  limit,
  sortOrder,
  filterText,
});

export const getAllById = state => state.byId;
export const getIds = state => state.ids;
export const getSortOrder = state => state.sortOrder;
export const getFilterText = state => state.filterText;
export const getLimit = state => state.limit;
