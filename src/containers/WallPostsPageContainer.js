import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import {
  getSearchIsActive, isLoggedInSelector, getAuthOfferFlag, getDelayedAuthOfferFlag,
  getIsRedirecting,
} from 'selectors';

import WallPostsPage from 'components/WallPostsPage';

class WallPostsPageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchStart = this.handleSearchStart.bind(this);
    this.handleSearchStop = this.handleSearchStop.bind(this);
  }

  componentDidMount() {
    const {
      rejectAuthOffer,
      isLoggedIn,
      location, // TODO: location: { hash, pathname },
    } = this.props;

    // TODO: display message to user if get auth error

    if (isLoggedIn) {
      console.info('isLoggedIn: ', isLoggedIn);
      rejectAuthOffer();
    }

    // TODO: sign in at search start
    // NOTE: store in localStorage path of page from wich token was requested
    // and return to it after parsing of auth data from hash
    // localStorage.setItem('url', current route path);
  }

  componentDidUpdate() {
    const { isLoggedIn, hasDelayedAuthOffer, rejectAuthOffer } = this.props;

    if (isLoggedIn && hasDelayedAuthOffer) {
      console.info('isLoggedIn after update: ', isLoggedIn);
      rejectAuthOffer();
    }
  }

  componentWillUnmount() {
    this.handleSearchStop();
    this.isPostsSearchDeferred = false;
  }

  handleSearchStart = (inputData) => {
    const {
      startWallPostsSearch2, isLoggedIn, login,
    } = this.props;

    // TODO: consider to dispatch startOrDeferPostsSearch thunk instead          !!!

    if (isLoggedIn) {
      console.log('FORM STATE: ', inputData); // TEMP
      startWallPostsSearch2(inputData);
      return;
    }
    // TODO: save input values to localStorage

    this.isPostsSearchDeferred = true;

    login().then(() => {
      console.log('is search deferred ', this.isPostsSearchDeferred);
      if (this.isPostsSearchDeferred) {
        startWallPostsSearch2(inputData);
      }
    });
  }

  handleSearchStop() {
    const { isSearchActive, terminateSearch } = this.props;

    if (isSearchActive) {
      terminateSearch();
    }
  }

  render() {
    // const {
    //   isSearchActive,
    //   isRedirecting,
    //   hasAuthOffer,
    //   posts,
    //   redirectToAuth,
    //   rejectAuthOffer,
    // } = this.props;

    return (
      <WallPostsPage
        onStartSearch={this.handleSearchStart}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: isLoggedInSelector(state),
  isRedirecting: getIsRedirecting(state),
  hasAuthOffer: getAuthOfferFlag(state),
  hasDelayedAuthOffer: getDelayedAuthOfferFlag(state),
  isSearchActive: getSearchIsActive(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

WallPostsPageContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  offerAuthRedirect: PropTypes.func.isRequired,
  startWallPostsSearch: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
};

WallPostsPageContainer.defaultProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WallPostsPageContainer);
