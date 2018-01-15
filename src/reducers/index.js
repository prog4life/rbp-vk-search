import { combineReducers } from 'redux';
// import * as reducers from './auth';
import { accessToken, tokenExpiry, userId } from './authReducers';
import { results, failedRequests, search } from './searchReducers';

// exporting of rootReducer
export default combineReducers({
  userId,
  accessToken,
  tokenExpiresAt: tokenExpiry,
  results,
  failedRequests: failedRequests,
  isSearching: search
});
