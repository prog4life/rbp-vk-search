import React from 'react';
import { connect } from 'react-redux';

import * as actionCreators from 'actions';
import { getVisiblePosts, getVisiblePostsIds, getPostsSortOrder } from 'selectors';
// import { getVisiblePostsIds, getPostsSortOrder } from 'selectors';

import ResultsPanel from 'components/ResultsPanel';
import SearchResultsFilter from 'components/SearchResultsFilter';
import FoundPostsList from 'components/FoundPostsList';
// import FoundPostsListById from 'components/FoundPostsList/FoundPostsListById';
// import FoundPostsListOptim from 'components/FoundPostsList/FoundPostsListOptim';

const PostsSearchResults = props => (
  <ResultsPanel heading={<SearchResultsFilter {...props} />}>
    <FoundPostsList {...props} />
    {/* <FoundPostsListById {...props} /> */}
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

export default connect(mapStateToProps, propsToDispatch)(PostsSearchResults);
