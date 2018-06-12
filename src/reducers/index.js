import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import search from './searchReducer';
import posts from './postsReducer';

// root reducer
export default combineReducers({
  auth,
  posts,
  search,
  form: formReducer,
});

// TODO: export mainReducer from './mainReducer';
