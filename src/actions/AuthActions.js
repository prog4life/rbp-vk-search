export function saveNewAccessToken(token) {
  return {
    type: 'SAVE_NEW_ACCESS_TOKEN',
    token
  };
}

export function setTokenExpiry(expiresAt) {
  return {
    type: 'SET_TOKEN_EXPIRY',
    expiresAt
  };
}

export function setUserId(userId) {
  return {
    type: 'SET_USER_ID',
    userId
  };
}
