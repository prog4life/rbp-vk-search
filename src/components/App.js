import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hot, setConfig } from 'react-hot-loader';

// import Home from 'containers/Home';
import WallPostsPageContainer from 'containers/WallPostsPageContainer';
import UserDataPageContainer from 'containers/UserDataPageContainer';
import NotFoundPage from 'components/NotFoundPage';

setConfig({ logLevel: 'error' }); // ['debug', 'log', 'warn', 'error'(default)]

// TODO: replace store creation to index.js and pass it as prop into here
// and make this component presentational, not container

const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        {/* <Route path="/" exact component={Home} /> */}
        {/* <Route path="/wall-posts" component={WallPostsPageContainer} /> */}
        <Route path="/" exact component={WallPostsPageContainer} />
        <Route path="/user-data" component={UserDataPageContainer} />
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
