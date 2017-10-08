export function resultsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULT':
      return {
        ...action.result
      };
    default:
      return state;
  }
}
