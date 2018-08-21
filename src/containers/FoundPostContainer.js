import { connect } from 'react-redux';
import FoundPostOptim from 'components/FoundPostsList/FoundPostOptim';

import { getPostById } from 'selectors';

// Using ownProps comes with a performance penalty: the inner props have to be
// recalculate any time the outer props change. However using initialOwnProps
// does not incur this penalty because it is only used once.
// https://stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux/37266130#37266130
const makeMapStateToProps = (initialState, initialOwnProps) => {
  const { postId } = initialOwnProps;
  // mapStateToProps
  return state => ({
    post: getPostById(state, postId),
  });
};

// prev version
// const mapStateToProps = (state, { postId }) => ({
//   post: getPostById(state, postId),
// });

export default connect(makeMapStateToProps)(FoundPostOptim);
