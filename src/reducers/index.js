import { combineReducers } from 'redux';
// import * as reducers from './auth';
import { accessToken, tokenExpiry, userId, userName } from './authReducers';
import { results, search } from './searchReducers';

// exporting of rootReducer
export default combineReducers({
  userId,
  accessToken,
  userName,
  tokenExpiresAt: tokenExpiry,
  results,
  search
});

// TODO: export mainReducer from './mainReducer'; // OR
// export { default } from './mainReducer';
