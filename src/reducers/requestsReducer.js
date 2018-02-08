function requests(state = [], action) {
  switch (action.type) {
    case 'REQUEST_FAIL'
      return state.map(;
    case 'REQUEST_SUCCESS'
      return ;
    case 'REQUEST_PENDING'
      return ;
    default:
      break;
  }
}