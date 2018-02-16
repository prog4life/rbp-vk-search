const changeExistingRequestState = (state, action, isPending, isDone) => (
  state.map((req) => {
    if (req.offset === action.offset) {
      return {
        ...req,
        // alternatively (if not passed from action): req.attempt + 1
        attempt: action.attempt,
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
    // attempt: action.attempt, // alternatively (if not passing from action): attempt: 0,
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
          attempt: action.attempt,
          isPending: true,
          isDone: false
        });
      // return state.some(req => req.offset === action.offset)
      //   ? changeRequestPendingState(state, action, true)
      //   : [...state, { offset: action.offset, isPending: true }];
    case 'REQUEST_SUCCESS':
      // TEMP: deleting only requests with same offset that have failed
      // probably better to remove later pending and successful reqs too
      return state.filter(req => !(req.offset === action.offset));
      // .concat({
      //   offset: action.offset,
      //   endTime: Date.now(), // TODO: change to action.endTime later?
      //   attempt: action.attempt,
      //   isPending: false,
      //   isDone: true
      // });
    case 'REQUEST_FAIL':
      return state.filter(req => req.offset !== action.offset)
        .concat({
          offset: action.offset,
          endTime: Date.now(), // TODO: remove or change to action.endTime later?
          attempt: action.attempt,
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

// const requests = (state = {}, action) => {
//   const key = `offset_${action.offset}`;

//   switch (action.type) {
//     case 'REQUEST_START':
//       return {
//         ...state,
//         [`offset_${action.offset}`]: {
//           id: `offset_${action.offset}`,
//           offset: action.offset,
//           startTime: action.startTime,
//           attempt: action.attempt,
//           isPending: true,
//           isDone: false
//         }
//       };
//     case 'REQUEST_SUCCESS':
//       return {
//         ...state,
//         [key]: {
//           id: key,
//           offset: action.offset,
//           startTime: (state[key] && state[key].startTime) || undefined,
//           endTime: Date.now(), // TODO: change to action.endTime later?
//           attempt: action.attempt,
//           isPending: false,
//           isDone: true
//         }
//       };
//     case 'REQUEST_FAIL':
//       return {
//         ...state,
//         [key]: {
//           id: key,
//           offset: action.offset,
//           startTime: (state[key] && state[key].startTime) || undefined,
//           attempt: action.attempt,
//           isPending: false,
//           isDone: false
//         }
//       };
//     case 'WALL_POSTS_SEARCH_START':
//     case 'SEARCH_TERMINATE':
//       return {};
//     default:
//       return state;
//   }
// };

// export default requests;
