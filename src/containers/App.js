import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hot, setConfig } from 'react-hot-loader';
// import Home from 'containers/Home';
import WallPostsSearch from 'containers/WallPostsSearch';
import NotFoundPage from 'components/NotFoundPage';
import configureStore from 'store/configureStore';
import { loadState, saveState } from 'utils/localStorage';

setConfig({ logLevel: 'log' }); // ['debug', 'log', 'warn', 'error']

const results = [
  {
    timestamp: 1582357458,
    authorId: 413870329,
    postId: 54525,
    text: 'Мне 29 лет симпатичная девушка. Ищу партнёра для интим отношений ' +
    'только постоянного, за материальную поддержку',
    link: 'https://vk.com/club75465366?w=wall-75465366_37844%2Fall',
  },
  {
    timestamp: 1323574580,
    authorId: 247772351,
    postId: 13585,
    text: 'Я ищу спонсора на длительные отношения, я без опыта, ' +
    'полненькая но не сильно, общительная. Пишите в л/с',
    link: 'https://vk.com/club75465366?w=wall-75465366_37824%2Fall',
  },
];

const persistedState = loadState('vk-search-state') || {};

// TODO: replace store creation to index.js and pass it as prop into here
// and make this component presentational, not container
const store = configureStore({
  ...persistedState,
  results,
});

// TODO: wrap in throttle or debounce
// store.subscribe(() => console.log('Updated state ', store.getState()));
store.subscribe(() => {
  const { userId, accessToken, tokenExpiresAt } = store.getState();
  const stateSliceToStore = {
    userId,
    accessToken,
    tokenExpiresAt,
  };
  saveState(stateSliceToStore, 'vk-search-state');
});

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        {/* <Route component={Home} exact path="/" /> */}
        {/* <Route component={WallPostsSearch} path="/wall-posts" /> */}
        <Route component={WallPostsSearch} exact path="/" />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  </Provider>
);

// export default hot(module)(App);
export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
// export default App;
