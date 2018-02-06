export function results(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      // TODO: prevent adding of same results
      // TODO: cut results
      return [...state, ...action.results].slice(0, action.limit);
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

const defaultSearchState = {
  isActive: false,
  processed: 0
  // total: undefined
  // progress: 0
};

export function search(state = defaultSearchState, action) {
  switch (action.type) {
    // case 'START_SEARCH':
    //   return true;
    case 'WALL_POSTS_SEARCH_START':
      return {
        ...state,
        isActive: true
      };
    case 'WALL_POSTS_SEARCH_END':
      // TODO: clean up search state values
      return {
        isActive: false,
        processed: 0
        // progress: 0
      };
    // NOTE: filtered in Redux logger config
    case 'UPDATE_SEARCH_PROGRESS':
      return {
        ...state,
        total: action.total || state.total,
        processed: action.processed || state.processed
      };
    // case 'FINISH_SEARCH':
    //   return false;
    case 'TERMINATE_SEARCH':
      // TODO: clean up search state values
      return {
        isActive: false,
        processed: 0
        // progress: 0
      };
    default:
      return state;
  }
}

// export function search(state = false, action) {
//   switch (action.type) {
//     // case 'START_SEARCH':
//     //   return true;
//     case 'WALL_POSTS_SEARCH_START':
//       return true;
//     case 'WALL_POSTS_SEARCH_END':
//       return false;
//     // case 'FINISH_SEARCH':
//     //   return false;
//     case 'TERMINATE_SEARCH':
//       return false;
//     default:
//       return state;
//   }
// }
