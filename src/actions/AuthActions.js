export function saveAccessTokenData(token, expiresAt) {
  return {
    type: 'SAVE_TOKEN_DATA',
    tokenData: {
      token,
      expiresAt
    }
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
