import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import immutabilityWatcher from 'redux-immutable-state-invariant';
// import { createLogger } from 'redux-logger';
// to use with Chrome Extension
// import { composeWithDevTools } from 'redux-devtools-extension';
// import { composeWithDevTools } from 'remote-redux-devtools';
import search from 'middleware/searchProcessor';
import callAPI from 'middleware/callAPI';
import rootReducer from '../reducers';

// must be the last middleware in chain
// const logger = createLogger({
//   duration: true,
//   // predicate: (getState, action) => action.type !== 'SEARCH_UPDATE'
//   predicate: (getState, action) => {
//     const hiddenTypes = [
//       'SEARCH::SET-OFFSET',
//       'SEARCH_UPDATE',
//       'REQUEST_START',
//       'REQUEST_SUCCESS',
//       'REQUEST_FAIL'
//     ];
//     return !hiddenTypes.some(type => type === action.type);
//   }
// });

// const watcher = immutabilityWatcher();

const middleware = process.env.NODE_ENV === 'development'
  ? [search, callAPI, thunk] // watcher(was 1st) and logger(was last) were removed
  : [search, callAPI, thunk];

const configureStore = (preloadedState = {}) => {
  // const composeEnhancers = composeWithDevTools({
  //   realtime: true,
  //   port: 8000, // the port local "remotedev-server" is running at
  // });

  return createStore(
    rootReducer,
    preloadedState,
    // composeEnhancers(applyMiddleware(...middleware)),
    applyMiddleware(...middleware),
  );
};

export default configureStore;
