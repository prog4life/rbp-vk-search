import React from 'react';
import { connect } from 'react-redux';

import { getSortedPosts } from 'selectors';

import ResultsPanel from 'components/ResultsPanel';
import SearchInResultsFilter from 'components/SearchInResultsFilter';
import FoundPostsList from 'components/FoundPostsList';

const PostsSearchResults = props => (
  <ResultsPanel heading={<SearchInResultsFilter {...props} />}>
    <FoundPostsList {...props} />
  </ResultsPanel>
);

const mapStateToProps = state => ({
  posts: getSortedPosts(state),
});

export default connect(mapStateToProps)(PostsSearchResults);
