import { connect } from 'react-redux';
import FoundPostOptim from 'components/FoundPostsList/FoundPostOptim';

import { getPostById } from 'selectors';

const makeMapStateToProps = (initState, initProps) => {
  // console.log('makeMSTP postId: ', initProps.postId);

  const { postId } = initProps;
  const mapStateToProps = (state, ownProps) => {
    // console.log('Optim mSTP, INIT === OWN postId: ', postId === ownProps.postId
    //   ? postId
    //   : ` INIT: ${postId}, OWN: ${ownProps.postId}`);

    return {
      post: getPostById(state, postId),
    };
  };

  return mapStateToProps;
};


export default connect(makeMapStateToProps)(FoundPostOptim);
