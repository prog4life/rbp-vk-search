import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import immutabilityWatcher from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';
// to use with Chrome Extension
// import { composeWithDevTools } from 'redux-devtools-extension';
import { composeWithDevTools } from 'remote-redux-devtools';
import search from 'middleware/searchProcessor';
import { mainSaga } from 'actions';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();
// must be the last middleware in chain
const logger = createLogger({
  duration: true,
  // predicate: (getState, action) => action.type !== 'SEARCH_UPDATE'
  predicate: (getState, action) => {
    const hiddenTypes = [
      // 'SEARCH::SET-OFFSET',
      // 'SEARCH_UPDATE',
      // 'SEARCH_REQUEST',
      // 'SEARCH_REQUEST_SUCCESS',
      // 'SEARCH_REQUEST_FAIL',
    ];
    return !hiddenTypes.some(type => type === action.type);
  },
});
const watcher = immutabilityWatcher();

const middleware = [watcher, search, sagaMiddleware, thunk, logger];

const configureStore = (preloadedState) => {
  const composeEnhancers = composeWithDevTools({
    name: 'vk-search',
    // realtime: true,
    // port setting required to use with local "remotedev-server", OR
    // use remotedev.io/local alternatively
    // set same port in any monitor app (browser/Atom/VS Code extension)
    port: 8000, // the port local "remotedev-server" is running at
  });

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

  sagaMiddleware.run(mainSaga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
