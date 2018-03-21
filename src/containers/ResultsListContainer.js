import { connect } from 'react-redux';

import ResultsList from 'components/ResultsList';

const mapStateToProps = ({ results }) => ({
  results,
});

export default connect(mapStateToProps)(ResultsList);
