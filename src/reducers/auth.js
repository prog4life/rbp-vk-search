const defaultTokenState = {
  token: '',
  expiresAt: null
};

export function tokenReducer(state = defaultTokenState, action) {
  switch (action.type) {
    case 'SAVE_TOKEN_DATA':
      return {
        token: action.token,
        expiresAt: action.expiresAt
      };
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
