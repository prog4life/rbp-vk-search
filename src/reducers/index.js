import { combineReducers } from 'redux';
// import * as reducers from './auth';
import { accessToken, tokenExpiry, userId, userName } from './authReducers';
import { results, search } from './searchReducers';
import requests from './requestsReducer';

// exporting of rootReducer
export default combineReducers({
  userId,
  accessToken,
  userName,
  tokenExpiresAt: tokenExpiry,
  results,
  search,
  requests
});

// TODO: export mainReducer from './mainReducer'; // OR
// export { default } from './mainReducer';
