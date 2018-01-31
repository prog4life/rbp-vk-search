export function results(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      // TODO: prevent adding of same results
      return [...state, ...action.results];
    // clear results at search start
    // case 'START_SEARCH':
    //   return [];
    case 'WALL_POSTS_SEARCH_START':
      return [];
    // case 'WALL_POSTS_SEARCH_END':
    //   return action.results.map(res => ({ ...res }));
    default:
      return state;
  }
}

export function search(state = false, action) {
  switch (action.type) {
    // case 'START_SEARCH':
    //   return true;
    case 'WALL_POSTS_SEARCH_START':
      return true;
    case 'WALL_POSTS_SEARCH_END':
      return false;
    // case 'FINISH_SEARCH':
    //   return false;
    case 'TERMINATE_SEARCH':
      return false;
    default:
      return state;
  }
}
