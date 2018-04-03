import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { getSortedPosts, getSearchIsActive, getAccessToken } from 'reducers';
import TopBar from 'components/TopBar';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';
import Delayed from 'components/Delayed';
import ErrorBoundary from 'components/ErrorBoundary';
import RedirectOfferModal from 'components/RedirectOfferModal';
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
      parseAccessTokenHash,
      offerAuthRedirect,
      accessToken,
      location,
      match,
      history,
    } = this.props;

    console.log('match obj ', match);
    console.log('location obj ', location);

    if (parseAccessTokenHash(location.hash.substr(1))) {
      history.replace(match.url);
      return;
    }
    // history.replace(match.url); // looks like redundant

    if (!accessToken) {
      offerAuthRedirect();
      return;
    }

    console.info('accessToken is already present: ', accessToken);

    // TODO: remove this temp redirect later and sign in at search start
    setTimeout(() => {
      // NOTE: store in localStorage path of page from wich token was requested
      // and return to it after parsing of auth data from hash
      // localStorage.setItem('url', current route path);
      // redirectToAuth(); // redirects to external vk api url
    }, 3000);

    // if (!accessToken) {
    //   setTimeout(() => {
    //     const result = window.confirm('You must be logged in your vk account' +
    //       ' to perform search. Do you want to log in now?');
    //     if (result) {
    //       window.location.replace(tokenRequestURL);
    //     }
    //   }, 3000);
    // }
  }
  componentWillUnmount() {
    this.handleSearchStop();
  }
  handleSearchStart = (inputData) => {
    const {
      startWallPostsSearch, checkAccessToken, redirectToAuth,
    } = this.props;

    if (checkAccessToken()) {
      console.log('FORM STATE: ', inputData); // TEMP
      startWallPostsSearch(inputData);
      return;
    }
    // TODO: save input values to localStorage; show redirection notification
    redirectToAuth();
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
      shouldOfferAuth,
      posts,
      redirectToAuth,
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
        {isRedirecting && <RedirectToAuthModal />}
        {/* TODO: replace by in-store modal displaying variable */}
        {shouldOfferAuth &&
          <ErrorBoundary>
            <Delayed
              component={
                <RedirectOfferModal onRedirectClick={redirectToAuth} />
              }
              delay={3000}
            />
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
  shouldOfferAuth: state.auth.shouldOfferAuth,
  // results: state.results,
  posts: getSortedPosts(state),
  // search: state.search,
  isSearchActive: getSearchIsActive(state),
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

WallPostsSearch.propTypes = {
  accessToken: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  parseAccessTokenHash: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  // results: PropTypes.arrayOf(PropTypes.object).isRequired,
  // search: PropTypes.shape({
  //   isActive: PropTypes.bool,
  //   total: PropTypes.number,
  //   processed: PropTypes.number,
  //   progress: PropTypes.number,
  // }).isRequired,
  signOut: PropTypes.func.isRequired,
  startWallPostsSearch: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
  // tokenExpiresAt: PropTypes.number.isRequired
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearch);
