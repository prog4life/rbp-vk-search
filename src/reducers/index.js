import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
// import * as reducers from './auth';
import { accessToken, tokenExpiry, userId, userName } from './authReducers';
import search, * as fromSearch from './searchReducer';
import results from './resultsReducer';
import requests from './requestsReducer';

// exporting of rootReducer
export default combineReducers({
  userId,
  accessToken,
  userName,
  tokenExpiresAt: tokenExpiry,
  results,
  search,
  requests,
});

export const getSearchIsActive = state => fromSearch.getIsActive(state.search);
export const getSearchTotal = state => fromSearch.getTotal(state.search);
export const getSearchProcessed = state => fromSearch.getProcessed(state.search);

export const getSearchProgress = createSelector(
  state => fromSearch.getTotal(state.search),
  state => fromSearch.getProcessed(state.search),
  (total, processsed) => {
    // count progress in percents
    if (Number.isInteger(total) && Number.isInteger(processsed)) {
      // return Number(((processsed / total) * 100).toFixed());
      return Math.round(((processsed / total) * 100));
    }
    return 0;
  },
);

// TODO: export mainReducer from './mainReducer'; // OR
// export { default } from './mainReducer';
