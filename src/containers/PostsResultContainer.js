import React from 'react';
import { connect } from 'react-redux';

import ResultsPanel from 'components/ResultsPanel';
import SearchInResultsFilter from 'components/SearchInResultsFilter';
import FoundPostsList from 'components/FoundPostsList';

const mapStateToProps = ({ results }) => ({
  results,
});

export default connect(mapStateToProps)((
  <ResultsPanel heading={<SearchInResultsFilter />}>
    <FoundPostsList posts={posts} />
  </ResultsPanel>
));
