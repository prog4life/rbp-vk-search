import { connect } from 'react-redux';
import FoundPostOptim from 'components/FoundPostsList/FoundPostOptim';

import { getPostById } from 'selectors';

const mapStateToProps = (state, { postId }) => ({
  post: getPostById(state, postId),
});

export default connect(mapStateToProps)(FoundPostOptim);
