import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import redirect from './redirectReducer';
import posts from './postsReducer';
import search from './searchReducer';

// root reducer
export default combineReducers({
  auth,
  redirect,
  posts,
  search,
  form: formReducer,
});

// TODO: export mainReducer from './mainReducer';
