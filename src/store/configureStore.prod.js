import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import immutabilityWatcher from 'redux-immutable-state-invariant';
// import { createLogger } from 'redux-logger';
// to use with Chrome Extension
// import { composeWithDevTools } from 'redux-devtools-extension';
import { composeWithDevTools } from 'remote-redux-devtools';
import search from 'middleware/searchProcessor';
import rootReducer from '../reducers';

// must be the last middleware in chain
// const logger = createLogger({
//   duration: true,
//   // predicate: (getState, action) => action.type !== 'SEARCH_UPDATE'
//   predicate: (getState, action) => {
//     const hiddenTypes = [
//       'SET_OFFSET',
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
  ? [search, thunk] // watcher(was 1st) and logger(was 2nd) were removed
  : [search, thunk];

const configureStore = (preloadedState = {}) => {
  /* eslint-disable no-underscore-dangle */
  /* to use with Chrome Extension without 'redux-devtools-extension' package: */
  // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  //   compose;
  /* eslint-enable */

  // devTools options object is optional, without it replace "composeEnhancers"
  // call with "composeWithDevTools"
  const composeEnhancers = composeWithDevTools({
    realtime: true, // if process.env.NODE_ENV not set as 'development'
    // host: '127.0.0.1', // default
    // port setting required to use with local "remotedev-server", OR
    // use remotedev.io/local alternatively
    // set same port in any monitor app (browser/Atom/VS Code extension)
    port: 8000 // the port local "remotedev-server" is running at
  });

  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );
};

export default configureStore;
