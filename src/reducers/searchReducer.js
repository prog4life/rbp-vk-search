const defaultSearchState = {
  isActive: false,
  processed: 0
  // total: undefined
  // progress: 0
};

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
//     case 'SEARCH_UPDATE_PROGRESS':
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

// 2nd version, for usage with alternative version of "searchProcessor"
// middleware, that stores whole search state using Redux store
const search = (state = defaultSearchState, action) => {
  switch (action.type) {
    case 'WALL_POSTS_SEARCH_START':
      return {
        isActive: true,
        processed: 0,
        offset: 0
        // progress: 0
      };
    case 'WALL_POSTS_SEARCH_END':
      return {
        ...state,
        isActive: false,
        total: action.total // equal to response.count
      };
    // case 'SEARCH_SET_TOTAL':
    //   return {
    //     ...state,
    //     total: action.total
    //   };
    case 'SEARCH_UPDATE_PROGRESS':
      return {
        ...state,
        total: action.total || state.total,
        processed: action.processed || state.processed
      };
    case 'SEARCH_SET_OFFSET':
      return {
        ...state,
        offset: action.offset
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

export default search;
