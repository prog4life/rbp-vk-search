import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from 'containers/Auth';
import WallPostsSearchPage from 'containers/WallPostsSearchPage';
import WallCommentsSearchPage from 'containers/WallCommentsSearchPage';
import NotFoundPage from 'components/NotFoundPage';

const App = () => (
  <Router>
    <Switch>
      <Route component={Auth} exact path="/" />
      <Route component={WallPostsSearchPage} path="/wall-posts" />
      <Route component={WallCommentsSearchPage} path="/wall-comments" />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default App;
