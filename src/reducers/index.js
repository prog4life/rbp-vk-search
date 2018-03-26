import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import sortBy from 'lodash.sortby';
import { sortItemsByNumField } from 'utils/sorting';
// import * as reducers from './auth';
import auth from './authReducer';
import search, * as fromSearch from './searchReducer';
import results from './resultsReducer';
import posts, * as fromPosts from './postsReducer';
import requests from './requestsReducer';

export default combineReducers({
  // userId,
  // accessToken,
  // userName,
  // tokenExpiresAt: tokenExpiry,
  auth,
  results,
  posts,
  search,
  requests,
});

export const getAuthData = state => state.auth;

export const getSearchIsActive = state => fromSearch.getIsActive(state.search);
export const getSearchTotal = state => fromSearch.getTotal(state.search);
export const getSearchProcessed = state => fromSearch.getProcessed(state.search);

export const getSearchProgress = createSelector(
  getSearchTotal,
  getSearchProcessed,
  (total, processsed) => {
    // count progress in percents
    if (Number.isInteger(total) && Number.isInteger(processsed)) {
      // return Number(((processsed / total) * 100).toFixed());
      return Math.round(((processsed / total) * 100));
    }
    return 0;
  },
);

const getPostsById = state => state.posts;

export const getSortedPosts = (state) => {
  // add getLimit
  // const allPosts = fromPosts.getPosts(state.posts);
  // return sortItemsByNumField(allPosts, 'timestamp');
  const postsById = getPostsById(state);
  return sortBy(postsById, ['timestamp']).reverse();
};

// TODO: export mainReducer from './mainReducer'; // OR
// export { default } from './mainReducer';
