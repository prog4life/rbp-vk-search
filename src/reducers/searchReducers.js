export function results(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      // TODO: prevent adding of same results
      // TODO: maybe need to sort in reducer
      return [...state, ...action.results].slice(0, action.limit);
    // clear results at search start
    // case 'PREPARE_SEARCH':
    //   return [];
    case 'WALL_POSTS_SEARCH_START':
      return [];
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
    // case 'PREPARE_SEARCH':
    //   return {
    //     ...state,
    //     isActive: true
    //   };
    case 'WALL_POSTS_SEARCH_START':
      return {
        isActive: true,
        processed: 0
        // progress: 0
      };
    case 'WALL_POSTS_SEARCH_END':
      // TODO: clean up search state values
      return {
        ...state,
        isActive: false
      };
    // NOTE: filtered in Redux logger config
    case 'UPDATE_SEARCH_PROGRESS':
      return {
        ...state,
        total: action.total || state.total,
        processed: action.processed || state.processed
      };
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
