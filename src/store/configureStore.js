import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
// to use with Chrome Extension 
// import {composeWithDevtools} from 'redux-devtools-extension';
import {composeWithDevtools} from 'remote-redux-devtools';

export default (preloadedState = {}) => {
  /* eslint-disable no-underscore-dangle */
  /* to use with Chrome Extension without 'redux-devtools-extension' package:
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    compose;

  const store = createStore(rootReducer, preloadedState, composeEnhancers(
    applyMiddleware(thunk))
  );                                                                    
  */
  /* eslint-enable */

  // devTools options object is optional, without it replace "composeEnhancers"
  // call with "composeWithDevtools"
  const composeEnhancers = composeWithDevtools({
    realtime: true, // instead of setting process.env.NODE_ENV as 'development'
    // required if using remotedev-server 
    port: 8031, // the port your remotedev server is running at
  });

  // if using 'redux-devtools-extension' package:
  const store = createStore(rootReducer, preloadedState, composeEnhancers(
    applyMiddleware(thunk)
  ));

  return store;
};
