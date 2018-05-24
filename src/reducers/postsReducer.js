import { combineReducers } from 'redux';
import { POSTS_RECEIVED, SEARCH_START } from 'constants/actionTypes.js';
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
//     case SEARCH_START:
//       return {};
//     default:
//       return state;
//   }
// }

// TODO: cut excess results at SEARCH_END
// TODO: add flag to check to show or not intermediate results during search

const byId = createReducer({}, {
  [POSTS_RECEIVED]: (state, action) => (
    action.ids.length > 0
      ? { ...state, ...action.itemsById }
      : state
  ),
  [SEARCH_START]: () => ({}),
});

const ids = createReducer({}, {
  [POSTS_RECEIVED]: (state, action) => (
    action.ids.length > 0
      ? makeUnion(state, action.ids)
      : state
  ),
  [SEARCH_START]: () => ([]),
});

const limit = createReducer(null, {
  [SEARCH_START]: (state, action) => action.limit,
});

export default combineReducers({
  byId,
  ids,
  limit,
});

export const getById = state => state.byId;
export const getIds = state => state.ids;
