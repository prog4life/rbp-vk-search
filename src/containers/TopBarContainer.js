import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import {
  getAccessToken, getUserId, getUserName, getSearchIsActive,
} from 'selectors';

import TopBar from 'components/TopBar';

class TopBarContainer extends React.Component {
  componentDidMount() {
    this.loadUserName();
  }
  componentDidUpdate(prevProps) {
    const { accessToken } = this.props;

    if (prevProps.accessToken !== accessToken) {
      this.loadUserName();
    }
  }
  loadUserName() {
    const { accessToken, userId, fetchUserName } = this.props;

    if (accessToken && userId) {
      fetchUserName(userId, accessToken);
    }
  }
  handleNavSelect = (eventKey) => { // (eventKey, event) => {
    const {
      accessToken, isSearchActive, signOut, terminateSearch, redirectToAuth,
    } = this.props;
    console.log('Select: ', eventKey);

    // 1.2 - Sign Out auth menu item
    if (eventKey === 1.2) {
      if (accessToken) {
        signOut();
      }

      if (isSearchActive) {
        terminateSearch();
      }
      return;
    }
    // 2 - Sign In nav item
    if (eventKey === 2) {
      redirectToAuth();
    }
  }
  render() {
    const { accessToken, userName, userId } = this.props;

    return (
      <TopBar
        isLoggedIn={Boolean(accessToken)}
        onNavSelect={this.handleNavSelect}
        userId={userId}
        userName={userName}
      />
    );
  }
}

TopBarContainer.propTypes = {
  accessToken: PropTypes.string,
  fetchUserName: PropTypes.func.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  redirectToAuth: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

TopBarContainer.defaultProps = {
  accessToken: null,
};

const mapStateToProps = state => ({
  accessToken: getAccessToken(state),
  isSearchActive: getSearchIsActive(state),
  userId: getUserId(state),
  userName: getUserName(state),
});

const {
  signOut, terminateSearch, redirectToAuth, fetchUserName,
} = actionCreators;

export default connect(mapStateToProps, {
  signOut,
  terminateSearch,
  redirectToAuth,
  fetchUserName,
})(TopBarContainer);

// const mergeProps = (stateProps, dispatchProps, ownProps) => ({
//   ...stateProps,
//   ...ownProps,
//   fetchUserName: dispatchProps.fetchUserName,
//   onNavSelect(eventKey, event) {
//     console.log('Select: ', eventKey);
//
//     // 1.2 - Sign Out auth menu item
//     if (eventKey === 1.2) {
//       const { accessToken, isSearchActive } = stateProps;
//
//       if (accessToken) {
//         dispatchProps.signOut();
//       }
//
//       if (isSearchActive) {
//         dispatchProps.terminateSearch();
//       }
//       return;
//     }
//     // 2 - Sign In nav item
//     if (eventKey === 2) {
//       const { redirectToAuth } = dispatchProps;
//       redirectToAuth();
//     }
//   },
// });
