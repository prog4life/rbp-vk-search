import 'config/polyfills'; // NOTE: import fetch and babel-polyfill separately ?
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash-es/debounce';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';

import configureStore from 'store/configureStore';
import { loadState, saveState } from 'utils/localStorage';

import App from 'components/App';

import 'styles/main.css';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

// TEMP
// const posts = {
//   byId: {
//     54525: {
//       timestamp: 1582357458,
//       authorId: 413870329,
//       id: 54525,
//       text: 'Мне 29 лет симпатичная девушка. Ищу партнёра для интим отношений ' +
//       'только постоянного, за материальную поддержку. Ищу партнёра для интим ' +
//       'отношений только постоянного, за материальную поддержку',
//       link: 'https://vk.com/club75465366?w=wall-75465366_37844%2Fall',
//     },
//     13585: {
//       timestamp: 1323574580,
//       authorId: 247772351,
//       id: 13585,
//       text: 'Я ищу спонсора на длительные отношения, я без опыта, ' +
//       'полненькая но не сильно, общительная. Пишите в л/с',
//       link: 'https://vk.com/club75465366?w=wall-75465366_37824%2Fall',
//     },
//   },
//   ids: [54525, 13585],
// };
// const posts = {
//   byId: null,
//   ids: null,
//   limit: null,
// };
const posts = null;

const persistedState = loadState('vk-search-state') || undefined;
const preloadedState = persistedState || posts
  ? {
    ...(persistedState || {}),
    // TEMP
    ...(posts ? { posts } : {}),
  }
  : undefined;

const store = configureStore(preloadedState);

store.subscribe(() => console.log(
  'State update ',
  (new Date()).toLocaleTimeString('en-Gb'),
));

// TODO: wrap in throttle or debounce
const saveStateDebounced = debounce(() => {
  const { auth } = store.getState();
  const stateToStore = {
    auth: { ...auth, isRedirecting: false, hasAuthOffer: false },
  };

  console.log(
    'save state debounced ',
    (new Date()).toLocaleTimeString('en-Gb'),
  );

  saveState(stateToStore, 'vk-search-state');
}, 500, { leading: true, trailing: true });

store.subscribe(saveStateDebounced);

ReactDOM.render(<App store={store} />, document.getElementById('app'));
