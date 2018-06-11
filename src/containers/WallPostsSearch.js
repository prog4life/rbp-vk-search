import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { getSortedPosts, getSearchIsActive, getAccessToken } from 'selectors';
import TopBar from 'components/TopBar';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';
import DelayedRender from 'components/common/DelayedRender';
import ErrorBoundary from 'components/common/ErrorBoundary';
import RedirectToAuthModal from 'components/RedirectToAuthModal';

import ResultsListContainer from 'containers/ResultsListContainer';

class WallPostsSearch extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchStart = this.handleSearchStart.bind(this);
    this.handleSearchStop = this.handleSearchStop.bind(this);
    this.handleNavSelect = this.handleNavSelect.bind(this);
  }
  componentDidMount() {
    const {
      extractAuthData,
      offerAuthRedirect,
      accessToken,
      location, // TODO: location: { hash, pathname },
      match,
    } = this.props;
    const { hash, pathname } = location;
    const parsedData = extractAuthData(hash.substr(1), pathname);

    // TODO: display message to user if error was parsed
    // also prevent repeated auth offer ?

    if (parsedData) {
      if (parsedData.accessToken) {
        console.info('new accessToken was retrieved: ', parsedData.accessToken);
      }
      return;
    }

    if (!accessToken) {
      offerAuthRedirect();
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
    offerAuthRedirect();
  }
  handleSearchStop() {
    const { isSearchActive, terminateSearch } = this.props;
    // TODO: check if search is active
    if (isSearchActive) {
      terminateSearch();
    }
  }
  handleNavSelect(eventKey, e) {
    console.log('Select: ', eventKey);

    if (eventKey === 1.2) {
      const { signOut } = this.props;
      signOut();
      this.handleSearchStop();
      return;
    }
    if (eventKey === 2) {
      const { redirectToAuth } = this.props;
      redirectToAuth();
    }
  }
  render() {
    const {
      isSearchActive,
      isRedirecting,
      hasAuthOffer,
      posts,
      redirectToAuth,
      cancelAuthRedirect,
      accessToken,
      userId,
      userName,
    } = this.props;

    return (
      <div className="wall-posts-search">
        <TopBar
          isLoggedIn={Boolean(accessToken)}
          onNavSelect={this.handleNavSelect}
          userId={userId}
          userName={userName}
        />
        {(hasAuthOffer || isRedirecting) &&
          <ErrorBoundary>
            <DelayedRender delay={3000}>
              <RedirectToAuthModal
                isRedirecting={isRedirecting}
                onRedirectClick={redirectToAuth}
                onCancelRedirect={cancelAuthRedirect}
              />
            </DelayedRender>
          </ErrorBoundary>
        }
        <SearchForm
          isSearchActive={isSearchActive}
          onStartSearch={this.handleSearchStart}
          // search={search}
        />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText="Here will be filter text" />
          <ResultsList results={posts} />
          {/* <ResultsListContainer /> */}
        </ResultsPanel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  userName: state.auth.userName,
  accessToken: getAccessToken(state),
  tokenExpiresAt: state.auth.tokenExpiresAt,
  isRedirecting: state.auth.isRedirecting,
  hasAuthOffer: state.auth.hasAuthOffer,
  // results: state.results,
  posts: getSortedPosts(state),
  // search: state.search,
  isSearchActive: getSearchIsActive(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

WallPostsSearch.propTypes = {
  accessToken: PropTypes.string,
  cancelAuthRedirect: PropTypes.func.isRequired,
  extractAuthData: PropTypes.func.isRequired,
  hasAuthOffer: PropTypes.bool.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  offerAuthRedirect: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  // results: PropTypes.arrayOf(PropTypes.object).isRequired,
  // search: PropTypes.shape({
  //   isActive: PropTypes.bool,
  //   total: PropTypes.number,
  //   processed: PropTypes.number,
  //   progress: PropTypes.number,
  // }).isRequired,
  redirectToAuth: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  startWallPostsSearch: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
  // tokenExpiresAt: PropTypes.number.isRequired
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

WallPostsSearch.defaultProps = {
  accessToken: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearch);
