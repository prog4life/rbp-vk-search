import { connect } from 'react-redux';

import {
  getSearchIsActive, getSearchTotal, getSearchProcessed,
  getSearchProgress, getIsCompleted,
} from 'selectors';
import { terminateSearch } from 'actions';
import SearchControls from 'components/SearchControls';

const mapStateToProps = state => ({
  isSearchActive: getSearchIsActive(state),
  isSearchCompleted: getIsCompleted(state),
  processed: getSearchProcessed(state),
  total: getSearchTotal(state),
  progress: getSearchProgress(state),
});

export default connect(mapStateToProps, { terminateSearch })(SearchControls);
