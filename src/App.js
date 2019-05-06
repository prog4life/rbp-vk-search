import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import Home from 'containers/Home';
import WallPostsPageContainer from 'containers/WallPostsPageContainer';
import UserDataPageContainer from 'containers/UserDataPageContainer';
import NotFoundPage from 'components/NotFoundPage';

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

// check for dev env is not required, can just do:
// export default hot(App);
export default process.env.NODE_ENV !== 'development' ? App : hot(App);
