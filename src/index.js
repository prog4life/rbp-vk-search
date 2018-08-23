import initPromise from 'config/vkOpenAPI';
import 'config/polyfills'; // NOTE: import fetch and babel-polyfill separately ?
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash-es/debounce';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';

import configureStore from 'store/configureStore';
import { loadState, saveState } from 'utils/localStorage';

import App from 'components/App';

import 'styles/main.scss';

// import * as selectors from 'selectors'; // for reselect-tools

const env = process.env.NODE_ENV;
const reactPerfDevtool = env === 'development'
  ? require('react-perf-devtool')
  : null;

if (env === 'development') {
  const { registerObserver } = reactPerfDevtool;

  registerObserver({ // both options for logging to console with additional lib
    // shouldLog: true,
    // port: 8080,
    // components: ['ControlButtons'],
  }, (measures) => {
    const componentsToCollect = [
      // 'Connect(FoundPostOptim)', 'FoundPost', 'FoundPostOptim',
      'FoundPostsList', 'FoundPostsListOptim',
    ];
    const result = !componentsToCollect.length
      ? measures
      : measures.filter(m => componentsToCollect.includes(m.componentName));

    // console.log(result); // can log "measures" right to console
  });
}
console.log('process.env.NODE_ENV: ', env);

// TEMP
const posts = {
  byId: {
    37844: {
      timestamp: 1582357458, // real: 1502185548
      authorId: 413870329,
      authorName: 'Анюта Кривонос',
      id: 37844,
      text: 'Мне 29 лет симпатичная девушка. Ищу партнёра для интим отношений ' +
      'только постоянного, за материальную поддержку. Ищу партнёра для интим ' +
      'отношений только постоянного, за материальную поддержку',
      link: 'https://vk.com/club75465366?w=wall-75465366_37844%2Fall',
      comments: 48115,
      likes: 0,
    },
    37824: {
      timestamp: 1323574580, // 1502173312
      authorId: 247772351,
      authorName: 'Анастасия Тихонова',
      id: 37824,
      text: 'Я ищу спонсора на длительные отношения, я без опыта, ' +
      'полненькая но не сильно, общительная. Пишите в л/с',
      link: 'https://vk.com/club75465366?w=wall-75465366_37824%2Fall',
      comments: 0,
      likes: 11543441497,
    },
  },
  ids: [37844, 37824],
};
// const posts = {
//   byId: null,
//   ids: null,
//   limit: null,
// };
// const posts = null;

const persistedState = loadState('vk-search-state') || undefined;
const preloadedState = persistedState || posts
  ? {
    ...(persistedState || {}),
    // TEMP
    ...(posts ? { posts } : {}),
  }
  : undefined;

const store = configureStore(preloadedState);

initPromise.then(() => {
  VK.Auth.getLoginStatus((response) => {
    console.info('VK.Auth.getLoginStatus RESPONSE: ', response);

    if (response.session) {
      console.log('User is authorized');
    }
  });
  store.dispatch({ type: 'OPEN_API_INITIALIZATION' });
});

store.subscribe(() => console.log(
  'State update ',
  (new Date()).toLocaleTimeString('en-Gb'),
));

// TODO: wrap in throttle or debounce
const saveStateDebounced = debounce(() => {
  const { auth } = store.getState();
  const stateToStore = {
    auth,
  };

  console.log(
    'Saved state with debounce ',
    stateToStore,
    (new Date()).toLocaleTimeString('en-Gb'),
  );

  saveState(stateToStore, 'vk-search-state');
}, 500, { leading: true, trailing: true });

store.subscribe(saveStateDebounced);

// if (env === 'development') {
//   const { registerSelectors, getStateWith } = require('reselect-tools');
//
//   registerSelectors(selectors);
//   getStateWith(() => store.getState());
// }

ReactDOM.render(<App store={store} />, document.getElementById('app'));
