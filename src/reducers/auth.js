// const defaultTokenState = '';

export function tokenReducer(state = '', action) {
  switch (action.type) {
    case 'SAVE_NEW_ACCESS_TOKEN':
      return action.token;
    case 'SET_TOKEN_EXPIRY':
      return action.expiresAt;
    default:
      return state;
  }
}

export function userIdReducer(state = null, action) {
  switch (action.type) {
    case 'SET_USER_ID':
      return action.userId;
    default:
      return state;
  }
}
