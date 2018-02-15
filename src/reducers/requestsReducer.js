const changeExistingRequestState = (state, action, isPending, isDone) => (
  state.map((req) => {
    if (req.offset === action.offset) {
      return {
        ...req,
        // alternatively (if not passed from action): req.retries + 1
        retries: action.retries,
        isPending,
        isDone
      };
    }
    return req;
  })
);

// const addNewRequest = (state, action, isPending, isDone) => (
const addNewRequest = (state, { type, ...rest }, isPending, isDone) => (
  [...state, {
    // offset: action.offset,
    // startTime: action.startTime,
    // endTime: action.endTime,
    // retries: action.retries, // alternatively (if not passing from action): retries: 0,
    ...rest,
    isPending,
    isDone
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
          isPending: true,
          isDone: false
        });
      // return state.some(req => req.offset === action.offset)
      //   ? changeRequestPendingState(state, action, true)
      //   : [...state, { offset: action.offset, isPending: true }];
    case 'REQUEST_SUCCESS':
      // TEMP: deleting only requests with same offset that have failed
      // probably better to remove later pending and successful reqs too
      return state.filter(req => !(req.offset === action.offset && !req.isPending && !req.isDone))
        .concat({
          offset: action.offset,
          endTime: Date.now(), // TODO: change to action.endTime later?
          // retries: action.retries,
          isPending: false,
          isDone: true
        });
    case 'REQUEST_FAIL':
      return state.filter(req => req.offset !== action.offset)
        .concat({
          offset: action.offset,
          endTime: Date.now(), // TODO: remove or change to action.endTime later?
          retries: action.retries,
          isPending: false,
          isDone: false
        });
    case 'WALL_POSTS_SEARCH_START':
    case 'SEARCH_TERMINATE':
      return [];
    default:
      return state;
  }
}
