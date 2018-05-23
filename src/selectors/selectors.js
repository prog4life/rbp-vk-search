import { createSelector } from 'reselect';
import sortBy from 'lodash-es/sortBy';
// import { sortItemsByNumField } from 'utils/sorting';
import { fromSearch, fromPosts } from 'reducers';

// const state = {
//   auth,
//   results,
//   posts,
//   search,
//   form,
// };

export const getAuthData = state => state.auth;

// TODO: extract "isTokenExpired" as separate selector ?
export const getAccessToken = createSelector(
  getAuthData,
  ({ accessToken, tokenExpiresAt }) => {
    const TEN_MINUTES = 10 * 60 * 1000;

    if (!accessToken) {
      return '';
    }
    if (tokenExpiresAt < Date.now() - TEN_MINUTES) {
      return '';
    }
    return accessToken;
  },
);

export const getSearchIsActive = state => fromSearch.getIsActive(state.search);
export const getSearchOffset = state => fromSearch.getOffset(state.search);
export const getSearchTotal = state => fromSearch.getTotal(state.search);
export const getSearchProcessed = state => fromSearch.getProcessed(state.search);

export const getRequestsById = state => fromSearch.getRequestsById(state.search);
export const getRequestById = (state, id) => getRequestsById(state)[id];
export const getIdsOfPending = state => fromSearch.getPendingRequestIds(state.search);
export const getIdsOfFailed = state => fromSearch.getFailedRequestIds(state.search);

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
