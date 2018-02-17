const defaultSearchState = {
  isActive: false,
  processed: 0
  // total: undefined
  // progress: 0
};

const search = (state = defaultSearchState, action) => {
  switch (action.type) {
    case 'WALL_POSTS_SEARCH_START':
      return {
        isActive: true,
        processed: 0
        // progress: 0
      };
    case 'WALL_POSTS_SEARCH_END':
      return {
        ...state,
        isActive: false
      };
    case 'SEARCH_UPDATE':
      return {
        ...state,
        total: action.total || state.total, // equal to response.count
        processed: action.processed || state.processed
      };
    case 'SEARCH_TERMINATE':
      return {
        isActive: false,
        processed: 0
        // progress: 0
      };
    default:
      return state;
  }
};

// PREV version
// export default function search(state = defaultSearchState, action) {
//   switch (action.type) {
//     // case 'PREPARE_SEARCH':
//     //   return {
//     //     ...state,
//     //     isActive: true
//     //   };
//     case 'WALL_POSTS_SEARCH_START':
//       return {
//         isActive: true,
//         processed: 0
//         // progress: 0
//       };
//     case 'WALL_POSTS_SEARCH_END':
//       // TODO: clean up search state values
//       return {
//         ...state,
//         isActive: false
//       };
//     // NOTE: filtered in Redux logger config
//     case 'SEARCH_UPDATE':
//       return {
//         ...state,
//         total: action.total || state.total,
//         processed: action.processed || state.processed
//       };
//     case 'SEARCH_TERMINATE':
//       // TODO: clean up search state values
//       return {
//         isActive: false,
//         processed: 0
//         // progress: 0
//       };
//     default:
//       return state;
//   }
// }

export default search;
