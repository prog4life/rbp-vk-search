import { createSelector } from 'reselect';
import sortBy from 'lodash-es/sortBy';
// import { sortItemsByNumField } from 'utils/sorting';
import * as fromAuth from 'reducers/authReducer';
import * as fromSearch from 'reducers/searchReducer';
import * as fromPosts from 'reducers/postsReducer';

// const state = {
//   auth,
//   posts,
//   search,
//   form,
// };

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

export const getSearchIsActive = state => fromSearch.getIsActive(state.search);
export const getIsCompleted = state => fromSearch.getIsCompleted(state.search);
export const getSearchOffset = state => fromSearch.getOffset(state.search);
export const getSearchTotal = state => fromSearch.getTotal(state.search);
export const getSearchProcessed = state => fromSearch.getProcessed(state.search);

export const getRequestsByOffset = state => (
  fromSearch.getRequestsByOffset(state.search)
);
export const getRequestByOffset = (state, offset) => (
  getRequestsByOffset(state)[offset]
);
export const getPendingList = state => fromSearch.getPendingList(state.search);
export const getFailedList = state => fromSearch.getFailedList(state.search);

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

export const getPostsById = state => fromPosts.getById(state.posts);
export const getIdsOfPosts = state => fromPosts.getIds(state.posts);

export const getSortedPosts = createSelector(
  getPostsById,
  (state, filter = 'timestamp') => filter,
  // TODO: rename order to reverse ?
  (state, filter, order = 'desc') => order,
  (postsById, filter, order) => {
    if (!postsById) {
      return null;
    }
    const arrayOfPosts = Object.values(postsById);
    const sorted = sortBy(arrayOfPosts, [filter]);

    return order === 'desc' ? sorted.reverse() : sorted;
  },
);

// export const getSortedPosts = (state) => {
//   // add getLimit
//   // const allPosts = fromPosts.getPosts(state.posts);
//   // return sortItemsByNumField(allPosts, 'timestamp');
//   const postsById = getPostsById(state);
//   return sortBy(postsById, ['timestamp']).reverse();
// };
