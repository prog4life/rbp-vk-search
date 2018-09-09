import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import {
  getUserPageHref, getUserName, getSearchIsActive, isLoggedInSelector,
  isAuthenticatingSelector,
} from 'selectors';

import TopBar from 'components/TopBar';

class TopBarContainer extends React.Component {
  handleNavSelect = (eventKey) => { // (eventKey, event) => {
    const {
      isLoggedIn, isAuthenticating, isSearchActive,
      login, logout, terminateSearch,
    } = this.props;

    console.log('Selected event key: ', eventKey);

    // 1.2 - Sign Out from TopBarNav
    if (eventKey === 1.2) {
      if (isLoggedIn) {
        logout();
      }

      if (isSearchActive) {
        terminateSearch();
      }
      return;
    }
    // 2 - Sign In from TopBarNav
    if (eventKey === 2 && !isAuthenticating) {
      login();
    }
  }

  render() {
    return <TopBar {...this.props} onNavSelect={this.handleNavSelect} />;
  }
}

TopBarContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticating: isAuthenticatingSelector(state),
  isLoggedIn: isLoggedInSelector(state),
  isSearchActive: getSearchIsActive(state),
  userPage: getUserPageHref(state),
  userName: getUserName(state),
});

const { terminateSearch, login, logout } = actionCreators;

export default connect(mapStateToProps, {
  login,
  logout,
  terminateSearch,
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
//         dispatchProps.logout();
//       }
//
//       if (isSearchActive) {
//         dispatchProps.terminateSearch();
//       }
//       return;
//     }
//     // 2 - Sign In nav item
//     if (eventKey === 2) {
//       const { login } = dispatchProps;
//       login();
//     }
//   },
// });
