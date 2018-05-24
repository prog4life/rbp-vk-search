import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import search from './searchReducer';
// import results from './resultsReducer';
import posts from './postsReducer';
// import requests from './requestsReducer';

// root reducer
export default combineReducers({
  auth,
  // results,
  posts,
  search,
  // requests,
  form: formReducer,
});

// TODO: export mainReducer from './mainReducer';
