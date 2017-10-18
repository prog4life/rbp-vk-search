export function sortResultsSubReducer(state = [], action) {
  return action.ascending
    ? state.sort((a, b) => a.timestamp - b.timestamp)
    : state.sort((a, b) => b.timestamp - a.timestamp);
}

export function resultsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      // TODO: prevent adding of same results
      return [...state, ...action.results];
    case 'SORT_RESULTS':
      return [...sortResultsSubReducer(state, action)];
    case 'CUT_EXCESS_RESULTS':
      return state.slice(0, action.amount);
    case 'ADD_SORT_CUT_RESULTS':
      return sortResultsSubReducer([...state, ...action.results], action)
        .slice(0, action.amount);
    case 'CLEAR_RESULTS':
      return [];
    default:
      return state;
  }
}

export function requestsReducer(state = [], action) {
  switch (action.type) {
    case 'FETCH_WALL_DATA_REQUEST':

      // TODO: add and check pending state reuests                                 !!!

      return state.filter(offset => offset !== action.offset);
    case 'FETCH_WALL_DATA_SUCCESS':
      return state.filter(offset => offset !== action.offset);
    case 'FETCH_WALL_DATA_FAIL':
      return state.indexOf(action.offset) === -1
        ? [...state, action.offset]
        : state;
    default:
      return state;
  }
}

export function searchReducer(state = false, action) {
  switch (action.type) {
    case 'SEARCH_START':
      return true;
    case 'SEARCH_STOP':
      return false;
    default:
      return state;
  }
}
