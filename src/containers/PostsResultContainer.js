import React from 'react';
import { connect } from 'react-redux';

import * as actionCreators from 'actions';
import { getVisiblePosts, getPostsSortOrder } from 'selectors';

import ResultsPanel from 'components/ResultsPanel';
import SearchResultsFilter from 'components/SearchResultsFilter';
import FoundPostsList from 'components/FoundPostsList';

const PostsSearchResults = props => (
  <ResultsPanel heading={<SearchResultsFilter {...props} />}>
    <FoundPostsList {...props} />
  </ResultsPanel>
);

const mapStateToProps = state => ({
  posts: getVisiblePosts(state),
  sortOrder: getPostsSortOrder(state),
});

const { setPostsSortOrder, setPostsFilterText } = actionCreators;

const propsToDispatch = { setPostsSortOrder, setPostsFilterText };

export default connect(mapStateToProps, propsToDispatch)(PostsSearchResults);
