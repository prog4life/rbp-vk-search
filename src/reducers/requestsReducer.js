const changeExistingRequestState = (state, action, isPending) => (
  state.map((req) => {
    if (req.offset === action.offset) {
      return {
        ...req,
        // alternatively (if not passed from action): req.attempts + 1
        attempts: action.attempts,
        isPending
      };
    }
    return req;
  })
);

// const addNewRequest = (state, action, isPending) => (
const addNewRequest = (state, { type, ...rest }, isPending) => (
  [...state, {
    // offset: action.offset,
    // startTime: action.startTime,
    // attempts: action.attempts, // alternatively (if not passing from action): attempts: 1,
    ...rest,
    isPending
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
          attempts: action.attempts,
          isPending: true
        });
    case 'REQUEST_SUCCESS':
      return state.filter(req => !(req.offset === action.offset));
    case 'REQUEST_FAIL':
      return state.filter(req => req.offset !== action.offset)
        .concat({
          offset: action.offset,
          endTime: Date.now(), // TODO: remove or change to action.endTime later?
          attempts: action.attempts,
          isPending: false
        });
    case 'WALL_POSTS_SEARCH_START':
    case 'SEARCH_TERMINATE':
      return [];
    default:
      return state;
  }
}
