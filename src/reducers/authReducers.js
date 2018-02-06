export function accessToken(state = '', action) {
  switch (action.type) {
    case 'SAVE_ACCESS_TOKEN':
      return action.accessToken;
    case 'SIGN_OUT':
      return '';
    default:
      return state;
  }
}

export function tokenExpiry(state = null, action) {
  switch (action.type) {
    case 'SAVE_ACCESS_TOKEN':
      return action.tokenExpiresAt;
    case 'SIGN_OUT':
      return null;
    default:
      return state;
  }
}

export function userId(state = '', action) {
  switch (action.type) {
    case 'SET_USER_ID':
      return action.userId;
    case 'SIGN_OUT':
      return '';
    default:
      return state;
  }
}

export function userName(state = '', action) {
  switch (action.type) {
    case 'SET_USER_NAME':
      return action.userName;
    case 'SIGN_OUT':
      return '';
    default:
      return state;
  }
}
