import { combineReducers } from 'redux';
// import * as reducers from './auth';
import { accessTokenReducer, tokenExpiryReducer, userIdReducer } from './auth';
import { resultsReducer, requestsReducer, searchReducer } from './search';

// exporting of rootReducer
export default combineReducers({
  userId: userIdReducer,
  accessToken: accessTokenReducer,
  tokenExpiresAt: tokenExpiryReducer,
  results: resultsReducer,
  failedRequests: requestsReducer,
  isSearching: searchReducer
});
