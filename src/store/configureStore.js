import {createStore, compose, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from '../reducers';
// import {composeWithDevtools} from 'redux-devtools-extension';

export default (preloadedState = {}) => {
  /* eslint-disable no-underscore-dangle */
  // if not installing 'redux-devtools-extension' package:
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    compose;
  /* eslint-enable */

  const store = createStore(rootReducer, preloadedState, composeEnhancers(
    applyMiddleware(thunk)
  ));

  // if using 'redux-devtools-extension' package:
  // const store = createStore(rootReducer, preloadedState, composeWithDevtools(
  //   applyMiddleware(thunk)
  // ));

  return store;
};
