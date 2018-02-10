const changeRequestPendingState = (state, action, isPending) => (
  state.map(req => (
    req.offset === action.offset
      ? { ...req, pending: isPending }
      : req
  ))
);

// failed or pending requests
export default function requests(state = [], action) {
  switch (action.type) {
    case 'REQUEST_START':
      // OR filter then add
      return state.some(req => req.offset === action.offset)
        ? changeRequestPendingState(state, action, true)
        : [...state, { offset: action.offset, pending: true }];
    case 'REQUEST_SUCCESS':
      return state.filter(req => req.offset !== action.offset);
    case 'REQUEST_FAIL':
      // OR filter then add
      return state.some(req => req.offset === action.offset)
        ? changeRequestPendingState(state, action, false)
        :
        state.concat({
          offset: action.offset,
          pending: false
        });
    case 'WALL_POSTS_SEARCH_START':
      return [];
    default:
      return state;
  }
}
