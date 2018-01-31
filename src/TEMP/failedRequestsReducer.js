export default function failedRequests(state = [], action) {
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