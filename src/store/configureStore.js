import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
// to use with Chrome Extension 
// import {composeWithDevTools} from 'redux-devtools-extension';
import {composeWithDevTools} from 'remote-redux-devtools';

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
  // call with "composeWithDevTools"
  const composeEnhancers = composeWithDevTools({
    realtime: true, // if process.env.NODE_ENV not set as 'development'
    // required to use local "remotedev-server", OR use remotedev.io/local alt
    // set same port in any monitor app (browser/Atom/VS Code extension)
    port: 8031 // the port local "remotedev-server" is running at
  });

  const store = createStore(rootReducer, preloadedState, composeEnhancers(
    applyMiddleware(thunk)
  ));

  return store;
};
