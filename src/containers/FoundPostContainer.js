import { connect } from 'react-redux';
import FoundPostEncaps from 'components/FoundPostsList/FoundPostEncaps';

import { getPostById } from 'selectors';

const mapStateToProps = (state, { postId }) => ({
  post: getPostById(state, postId),
});

export default connect(mapStateToProps)(FoundPostEncaps);
