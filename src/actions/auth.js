export const saveAccessTokenData = (token, expiresAt) => ({
  type: 'SAVE_TOKEN_DATA',
  token,
  expiresAt
});

export const setTokenExpiry = expiresAt => ({
  type: 'SET_TOKEN_EXPIRY',
  expiresAt
});

export const setUserId = userId => ({
  type: 'SET_USER_ID',
  userId
});
