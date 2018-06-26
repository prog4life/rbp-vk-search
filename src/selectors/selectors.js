import { createSelector } from 'reselect';
import sortBy from 'lodash-es/sortBy';
// import { sortItemsByNumField } from 'utils/sorting';
import * as fromAuth from 'reducers/authReducer';
import * as fromRedirect from 'reducers/redirectReducer';
import * as fromSearch from 'reducers/searchReducer';
import * as fromRequests from 'reducers/requestsReducer';
import * as fromPosts from 'reducers/postsReducer';

// const state = {
//   auth,
//   redirect,
//   posts,
//   search,
//   requests,
//   form,
// };

// ------------------------------ AUTH ----------------------------------------
export const getAuthData = state => state.auth;
export const getUserId = state => fromAuth.getUserId(state.auth);
export const getUserName = state => fromAuth.getUserName(state.auth);

// TODO: extract "isTokenExpired" as separate selector ?
export const getAccessToken = createSelector(
  getAuthData,
  ({ accessToken, tokenExpiresAt }) => {
    const TEN_MINUTES = 10 * 60 * 1000;

    if (!accessToken) {
      return null;
    }
    if (tokenExpiresAt < Date.now() - TEN_MINUTES) {
      return null;
    }
    return accessToken;
  },
);

// ------------------------------ REDIRECT ------------------------------------
export const getIsRedirecting = state => (
  fromRedirect.getIsRedirecting(state.redirect)
);
export const getDelayedAuthOfferFlag = state => (
  fromRedirect.getDelayedAuthOffer(state.redirect)
);
export const getAuthOfferFlag = state => fromRedirect.getAuthOffer(state.redirect);

// ------------------------------ SEARCH --------------------------------------
export const getSearchIsActive = state => fromSearch.getIsActive(state.search);
export const getIsCompleted = state => fromSearch.getIsCompleted(state.search);
export const getSearchOffset = state => fromSearch.getOffset(state.search);
export const getSearchTotal = state => fromSearch.getTotal(state.search);
export const getSearchProcessed = state => fromSearch.getProcessed(state.search);
export const getSearchErrorCode = state => fromSearch.getErrorCode(state.search);

export const getSearchProgress = createSelector(
  getSearchTotal,
  getSearchProcessed,
  // count progress in percents
  (total, processed) => {
    if (total === null && processed === 0) {
      return 0;
    }
    if (total && Number.isInteger(total) && Number.isInteger(processed)) {
      // return Number(((processed / total) * 100).toFixed());
      return Math.round(((processed / total) * 100));
    }
    return null;
  },
);

// ------------------------------ REQUESTS ---------------------------------------
export const getRequestsByOffset = state => (
  fromRequests.getAllByOffset(state.requests)
);
// single request obj
export const getRequestByOffset = (state, offset) => (
  getRequestsByOffset(state)[offset]
);
export const getPendingList = state => fromRequests.getPending(state.requests);
export const getFailedList = state => fromRequests.getFailed(state.requests);

// ------------------------------ POSTS ---------------------------------------
export const getPostsById = state => fromPosts.getById(state.posts);
export const getIdsOfPosts = state => fromPosts.getIds(state.posts);
export const getPostsSortOrder = state => fromPosts.getSortOrder(state.posts);
export const getPostsFilterText = state => fromPosts.getFilterText(state.posts);

// NOTE: consider alternative: sorting by timestamp before filtering by text

export const getFilteredByTextPosts = createSelector(
  [getPostsById, getPostsFilterText],
  (postsById, filterText) => {
    if (!postsById) {
      return null;
    }
    const arrayOfPosts = Object.values(postsById);
    const updFilterText = filterText.trim().toLowerCase();

    if (updFilterText === '') {
      return arrayOfPosts;
    }
    return arrayOfPosts.filter(post => (
      post.text.toLowerCase().includes(updFilterText)
    ));
  },
);

export const getSortedByTimestampPosts = createSelector(
  getFilteredByTextPosts,
  (filteredPosts) => {
    if (!filteredPosts) {
      return null;
    }
    const sorted = sortBy(filteredPosts, ['timestamp']); // => new array

    return sorted;
  },
);

export const getVisiblePosts = createSelector(
  [getSortedByTimestampPosts, getPostsSortOrder],
  // (state, sortOrder = 'descend') => sortOrder,
  (sortedPosts, sortOrder) => {
    if (!sortedPosts) {
      return null;
    }
    return sortOrder === 'descend'
      ? [].concat(sortedPosts).reverse() // NOTE: think over lodash's "orderBy"
      : sortedPosts;
  },
);
