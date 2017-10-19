import { combineReducers } from 'redux';
// import * as reducers from './auth';
import { tokenReducer, userIdReducer } from './auth';
import { resultsReducer, requestsReducer, searchReducer } from './search';

// exporting of rootReducer
export default combineReducers({
  userId: userIdReducer,
  tokenData: tokenReducer,
  results: resultsReducer,
  failedRequests: requestsReducer,
  isSearching: searchReducer
});
