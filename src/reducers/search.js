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
    // case 'WALL_POSTS_SEARCH_END':
    //   return action.results.map(res => ({ ...res }));
    default:
      return state;
  }
}

export function requestsReducer(state = [], action) {
  switch (action.type) {
    case 'FETCH_WALL_DATA_REQUEST':
      return state.map((failedReq) => {
        if (failedReq.offset === action.offset) {
          return {
            offset: action.offset,
            pending: true
          };
        }
        return failedReq;
      });
    case 'FETCH_WALL_DATA_SUCCESS':
      return state.filter(failedReq => failedReq.offset !== action.offset);
    case 'FETCH_WALL_DATA_FAIL':
      return state.filter(failedReq => failedReq.offset !== action.offset)
        .concat([{
          offset: action.offset,
          pending: false
        }]);

      // return state.some(failedReq => failedReq.offset === action.offset)
      //   ? state
      //   :
      //   state.concat([{
      //     offset: action.offset,
      //     pending: false
      //   }]);

      // if (state.some(failedReq => failedReq.offset === action.offset)) {
      //   return state;
      // }
      // return state.concat([{
      //   offset: action.offset,
      //   pending: false
      // }]);
    default:
      return state;
  }
}

export function searchReducer(state = false, action) {
  switch (action.type) {
    case 'START_SEARCH':
      return true;
    case 'FINISH_SEARCH':
      return false;
    default:
      return state;
  }
}
