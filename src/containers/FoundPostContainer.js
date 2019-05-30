import { connect } from 'react-redux';
import FoundPostOptim from 'components/FoundPostsList/FoundPostOptim';

import { getPostById } from 'selectors';

// Using ownProps comes with a performance penalty: the inner props have to be
// recalculate any time the outer props change. However using initialOwnProps
// does not incur this penalty because it is only used once.
// Can separate "itemIds" from "itemsById", and then only have whole "List"
// re-render if "itemIds" change
// This way changes to individual items won’t affect the list itself, and only
// the corresponding Item component will get re-rendered
// https://stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux/37266130#37266130
// NOTE: this techique is not really changing something in this case
const makeMapStateToProps = (initialState, initialOwnProps) => {
  const { postId } = initialOwnProps;
  // console.log('makeMapStateToProps ', { postId });
  // mapStateToProps
  return (state) => {
    const post = getPostById(state, postId);
    // console.log('FoundPostContainer mapStateToProps ', { postId: post.id });
    return {
      post,
    };
  };
};

// const mapStateToProps = (state, { postId }) => {
//   const post = getPostById(state, postId);
//   console.log('FoundPostContainer mapStateToProps ', { postId: post.id });
//   return { post };
// };

export default connect(makeMapStateToProps)(FoundPostOptim);
// export default connect(mapStateToProps)(FoundPostOptim);
