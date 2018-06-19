import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { getSearchIsActive, getAccessToken } from 'selectors';

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
      offerAuthRedirect,
      accessToken,
      location, // TODO: location: { hash, pathname },
    } = this.props;
    const { hash, pathname } = location;
    const parsedData = extractAuthData(hash.substr(1), pathname);

    // TODO: display message to user if error was parsed
    // also prevent repeated auth offer ?

    if (parsedData) {
      if (parsedData.accessToken) { // TEMP:
        console.info('new accessToken was retrieved: ', parsedData.accessToken);
      }
      return;
    }

    if (!accessToken) {
      offerAuthRedirect({ hasDelay: true });
      return;
    }
    console.info('accessToken is already present: ', accessToken);
    // TODO: sign in at search start
    // NOTE: store in localStorage path of page from wich token was requested
    // and return to it after parsing of auth data from hash
    // localStorage.setItem('url', current route path);
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
    // TODO: save input values to localStorage; show redirection notification
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
    //   rejectAuthRedirect,
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
  tokenExpiresAt: state.auth.tokenExpiresAt,
  isRedirecting: state.auth.isRedirecting,
  hasAuthOffer: state.auth.hasAuthOffer,
  hasDelayedAuthOffer: state.auth.hasDelayedAuthOffer,
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
