import { connect } from 'react-redux';

import SearchControls from 'components/SearchControls';
import countSearchProgressInPercents from 'selectors/selectors';

const mapStateToProps = ({ search }) => ({
  isSearchActive: search.isActive,
  processed: search.processed,
  total: search.total,
  progress: countSearchProgressInPercents(search)
});

export default connect(mapStateToProps)(SearchControls);
