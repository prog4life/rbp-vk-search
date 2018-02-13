const changeRequestPendingState = (state, action, isPending) => (
  state.map(req => (
    req.offset === action.offset
      ? { ...req, pending: isPending }
      : req
  ))
);

// failed or pending requests, not all requests
export default function requests(state = [], action) {
  switch (action.type) {
    case 'REQUEST_START':
      return state.filter(req => req.offset !== action.offset)
        .concat({
          offset: action.offset,
          pending: true,
          timestamp: Date.now()
        });
      // return state.some(req => req.offset === action.offset)
      //   ? changeRequestPendingState(state, action, true)
      //   : [...state, { offset: action.offset, pending: true }];
    case 'REQUEST_SUCCESS':
      return state.filter(req => req.offset !== action.offset);
    case 'REQUEST_FAIL':
      return state.filter(req => req.offset !== action.offset)
        .concat({
          offset: action.offset,
          pending: false
        });
    case 'WALL_POSTS_SEARCH_START':
    case 'TERMINATE_SEARCH':
      return [];
    default:
      return state;
  }
}
