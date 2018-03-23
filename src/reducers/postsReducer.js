import {
  ADD_RESULTS,
  WALL_POSTS_SEARCH_START,
} from 'constants/actionTypes.js';

export default function posts(state = {}, action) {
  switch (action.type) {
    case ADD_RESULTS: {
      const isEmpty = Object.keys(action.results).length < 1;
      return isEmpty ? state : {
        ...state,
        ...action.results,
      };
    }
    case WALL_POSTS_SEARCH_START:
      return {};
    default:
      return state;
  }
}

export const getPosts = state => Object.values(state);
