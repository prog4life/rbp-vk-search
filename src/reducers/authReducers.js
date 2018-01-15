export function accessToken(state = '', action) {
  switch (action.type) {
    case 'SAVE_ACCESS_TOKEN':
      return action.accessToken;
    default:
      return state;
  }
}

export function tokenExpiry(state = null, action) {
  switch (action.type) {
    case 'SAVE_ACCESS_TOKEN':
      return action.tokenExpiresAt;
    default:
      return state;
  }
}

export function userId(state = null, action) {
  switch (action.type) {
    case 'SET_USER_ID':
      return action.userId;
    default:
      return state;
  }
}
