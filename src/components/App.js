import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from 'containers/Home';
import WallPostsSearchPage from 'containers/WallPostsSearchPage';
import WallCommentsSearchPage from 'containers/WallCommentsSearchPage';
import NotFoundPage from 'components/NotFoundPage';

const App = () => (
  <Router>
    <Switch>
      <Route component={Home} exact path="/" />
      <Route component={WallPostsSearchPage} path="/wall-posts" />
      <Route component={WallCommentsSearchPage} path="/wall-comments" />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default App;
