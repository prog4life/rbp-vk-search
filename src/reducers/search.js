export function sortResultsSubReducer(state = [], action) {
  const newResults = [...state, ...action.results];

  return newResults.sort((a, b) => b.timestamp - a.timestamp);
}

export function resultsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      return sortResultsSubReducer(state, action);
    case 'CLEAR_RESULTS':
      return [];
    default:
      return state;
  }
}

export function requestsReducer(state = [], action) {
  switch (action.type) {
    case 'FETCH_WALL_DATA_FAIL':
      return [
        ...state,
        action.offset
      ];
    default:
      return state;
  }
}
