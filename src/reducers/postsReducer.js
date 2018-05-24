import { combineReducers } from 'redux';
import { FETCH_WALL_POSTS_SUCCESS, SEARCH_START } from 'constants/actionTypes.js';
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
  [FETCH_WALL_POSTS_SUCCESS]: (state, action) => (
    action.ids.length === 0 ? state : { ...state, ...action.itemsById }
  ),
  [SEARCH_START]: () => ({}),
});

const ids = createReducer({}, {
  [FETCH_WALL_POSTS_SUCCESS]: (state, action) => (
    action.ids.length === 0 ? state : makeUnion(state, action.ids)
  ),
  [SEARCH_START]: () => ([]),
});

export default combineReducers({
  byId,
  ids,
});

export const getById = state => state.byId;
export const getIds = state => state.ids;
