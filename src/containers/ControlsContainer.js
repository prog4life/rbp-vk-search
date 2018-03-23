import { connect } from 'react-redux';

import {
  getSearchIsActive, getSearchTotal, getSearchProcessed, getSearchProgress,
} from 'reducers';
import { terminateSearch } from 'actions';
import SearchControls from 'components/SearchControls';

const mapStateToProps = state => ({
  isSearchActive: getSearchIsActive(state),
  processed: getSearchProcessed(state),
  total: getSearchTotal(state),
  // progress: countSearchProgressInPercents(search)
  progress: getSearchProgress(state),
});

export default connect(mapStateToProps, { terminateSearch })(SearchControls);
