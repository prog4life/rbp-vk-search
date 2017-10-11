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
