export function resultsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      return [
        ...state,
        ...action.results
      ];
    default:
      return state;
  }
}

export function requestsReducer(state = [], action) {
  switch (action.type) {
    case 'FETCH_WALL_POSTS_FAIL':
      return [
        ...state,
        action.offset
      ];
    default:
      return state;
  }
}
