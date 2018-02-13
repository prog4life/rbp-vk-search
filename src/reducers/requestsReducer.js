const changeExistingRequestState = (state, action, isPending) => (
  state.map((req) => {
    if (req.offset === action.offset) {
      return {
        ...req,
        // alternatively (if not passed from action): req.retries + 1
        retries: action.retries,
        pending: isPending
      };
    }
    return req;
  })
);

const addNewRequest = (state, { offset, startTime, retries }, isPending) => (
  [...state, {
    offset,
    startTime,
    retries, // alternatively (if not passed from action): retries: 0,
    pending: isPending
  }]
);

// failed or pending requests, not all requests
export default function requests(state = [], action) {
  switch (action.type) {
    case 'REQUEST_START':
      return state.filter(req => req.offset !== action.offset)
        .concat({
          offset: action.offset,
          startTime: action.startTime,
          retries: action.retries,
          pending: true
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
          retries: action.retries,
          pending: false
        });
    case 'WALL_POSTS_SEARCH_START':
    case 'TERMINATE_SEARCH':
      return [];
    default:
      return state;
  }
}
