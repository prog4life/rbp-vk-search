import {combineReducers} from 'redux';
// import * as reducers from './auth';
import {tokenReducer, userIdReducer} from './auth';

// exporting of rootReducer
export default combineReducers({
  accessToken: tokenReducer,
  // tokenExpiresAt: tokenReducer,
  userId: userIdReducer
  // results: resultsReducer
});
