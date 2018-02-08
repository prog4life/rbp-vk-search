const changeRequestPendingState = (state, action, isPending) => (
  state.map(req => (
    req.offset === action.offset
      ? { ...req, pending: isPending }
      : req
  ))
);

// for failed requests, not for all
export default function requests(state = [], action) {
  switch (action.type) {
    case 'REQUEST_FAIL':
      // OR filter then add
      return state.some(req => req.offset === action.offset)
        ? changeRequestPendingState(state, action, false)
        :
        state.concat({
          offset: action.offset,
          pending: false
        });
    case 'REQUEST_SUCCESS':
      return state.filter(req => req.offset !== action.offset);
    case 'REQUEST_PENDING':
      return state.some(req => req.offset === action.offset)
        ? changeRequestPendingState(state, action, true)
        : [...state];
    default:
      return state;
  }
}
