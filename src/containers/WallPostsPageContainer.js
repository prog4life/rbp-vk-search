import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import {
  getSearchIsActive, getAccessToken, getAuthOfferFlag, getDelayedAuthOfferFlag,
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
      extractAuthData,
      rejectAuthOffer,
      accessToken,
      location, // TODO: location: { hash, pathname },
    } = this.props;
    const { hash, pathname } = location;

    extractAuthData(hash.substr(1), pathname);

    // TODO: display message to user if error was parsed

    // if (parsedData) {
    //   if (parsedData.accessToken) { // TEMP:
    //     console.info('new accessToken was retrieved: ', parsedData.accessToken);
    //   }
    //   return;
    // }

    if (accessToken) {
      console.info('accessToken is already present: ', accessToken);
      rejectAuthOffer();
    }

    // TODO: sign in at search start
    // NOTE: store in localStorage path of page from wich token was requested
    // and return to it after parsing of auth data from hash
    // localStorage.setItem('url', current route path);
  }

  componentDidUpdate() {
    const { accessToken, hasDelayedAuthOffer, rejectAuthOffer } = this.props;

    if (accessToken && hasDelayedAuthOffer) {
      console.info('accessToken is present after update: ', accessToken);
      rejectAuthOffer();
    }
  }

  componentWillUnmount() {
    this.handleSearchStop();
  }

  handleSearchStart = (inputData) => {
    const {
      startWallPostsSearch, accessToken, offerAuthRedirect,
    } = this.props;

    if (accessToken) {
      console.log('FORM STATE: ', inputData); // TEMP
      startWallPostsSearch(inputData);
      return;
    }
    // TODO: save input values to localStorage
    offerAuthRedirect({ hasDelay: false });
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
  accessToken: getAccessToken(state),
  isRedirecting: getIsRedirecting(state),
  hasAuthOffer: getAuthOfferFlag(state),
  hasDelayedAuthOffer: getDelayedAuthOfferFlag(state),
  isSearchActive: getSearchIsActive(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

WallPostsPageContainer.propTypes = {
  accessToken: PropTypes.string,
  extractAuthData: PropTypes.func.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  offerAuthRedirect: PropTypes.func.isRequired,
  startWallPostsSearch: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
};

WallPostsPageContainer.defaultProps = {
  accessToken: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WallPostsPageContainer);
