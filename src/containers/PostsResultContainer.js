import React from 'react';
import { connect } from 'react-redux';

import { changePostsOrder } from 'actions';
import { getPosts, getSortOrder } from 'selectors';

import ResultsPanel from 'components/ResultsPanel';
import SearchInResultsFilter from 'components/SearchInResultsFilter';
import FoundPostsList from 'components/FoundPostsList';

const PostsSearchResults = props => (
  <ResultsPanel heading={<SearchInResultsFilter {...props} />}>
    <FoundPostsList {...props} />
  </ResultsPanel>
);

const mapStateToProps = state => ({
  posts: getPosts(state),
  order: getSortOrder(state),
});

const mapDispatchToProps = { changePostsOrder };

export default connect(mapStateToProps, mapDispatchToProps)(PostsSearchResults);
