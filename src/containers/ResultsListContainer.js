import { connect } from 'react-redux';

import FoundPostsList from 'components/FoundPostsList';

const mapStateToProps = ({ results }) => ({
  results,
});

export default connect(mapStateToProps)(FoundPostsList);
