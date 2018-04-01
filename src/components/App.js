import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hot, setConfig } from 'react-hot-loader';

// import Home from 'containers/Home';
import WallPostsSearch from 'containers/WallPostsSearch';
import NotFoundPage from 'components/NotFoundPage';

setConfig({ logLevel: 'error' }); // ['debug', 'log', 'warn', 'error'(default)]

// TODO: replace store creation to index.js and pass it as prop into here
// and make this component presentational, not container

const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        {/* <Route path="/" exact component={Home} /> */}
        {/* <Route path="/wall-posts" component={WallPostsSearch} /> */}
        <Route path="/" exact component={WallPostsSearch} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  </Provider>
);

App.propTypes = {
  store: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

// export default hot(module)(App);
export default process.env.NODE_ENV === 'production' ? App : hot(module)(App);
// export default App;
