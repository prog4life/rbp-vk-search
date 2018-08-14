import React from 'react';
import { connect } from 'react-redux';

import * as actionCreators from 'actions';
import { getVisiblePosts, getVisiblePostsIds, getPostsSortOrder } from 'selectors';

import ResultsPanel from 'components/ResultsPanel';
import SearchResultsFilter from 'components/SearchResultsFilter';
import FoundPostsList from 'components/FoundPostsList';
// import FoundPostsListOptim from 'components/FoundPostsList/FoundPostsListOptim';

const PostsPanelContainer = props => (
  <ResultsPanel heading={<SearchResultsFilter {...props} />}>
    <FoundPostsList {...props} />
    {/* <FoundPostsListOptim {...props} /> */}
  </ResultsPanel>
);

const mapStateToProps = state => ({
  posts: getVisiblePosts(state),
  postIds: getVisiblePostsIds(state),
  sortOrder: getPostsSortOrder(state),
});

const { setPostsSortOrder, setPostsFilterText } = actionCreators;

const propsToDispatch = { setPostsSortOrder, setPostsFilterText };

export default connect(mapStateToProps, propsToDispatch)(PostsPanelContainer);
