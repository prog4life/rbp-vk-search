import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './authReducer';
import redirect from './redirectReducer';
import posts from './postsReducer';
import search from './searchReducer';
import requests from './requestsReducer';

import searchByItems from './searchByItemsReducer';
import requestsById from './requestsByIdReducer';

// root reducer
export default combineReducers({
  // access token, token expiry and user id returned by vk API
  auth,
  // redirection to authenticate by vk.com
  redirect,
  // found posts from wall
  posts,
  // search status and overall progress
  search,
  // state of multiple search requests
  requests,
  form: formReducer,
  searchByItems,
  requestsById,
});

// TODO: export mainReducer from './mainReducer';
