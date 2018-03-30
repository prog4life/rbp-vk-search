import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { getSortedPosts, getSearchIsActive } from 'reducers';
import TopBar from 'components/TopBar';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';
import RedirectConfirmModal from 'components/RedirectConfirmModal';
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
      checkAccessToken,
      redirectToAuth,
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

    const accessToken = checkAccessToken();

    if (accessToken) {
      console.info('accessToken is already present: ', accessToken);
      return;
    }

    // TODO: remove this temp redirect later and sign in at search start
    setTimeout(() => {
      <RedirectConfirmModal onRedirectClick={redirectToAuth} />
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
      isSearchActive, isRedirecting, posts, accessToken, userId, userName,
    } = this.props;

    return (
      <div className="wall-posts-search">
        <TopBar
          isLoggedIn={Boolean(accessToken)}
          onNavSelect={this.handleNavSelect}
          userId={userId}
          userName={userName}
        />
        <SearchForm
          isSearchActive={isSearchActive}
          onStartSearch={this.handleSearchStart}
          // search={search}
        />
        {isRedirecting && <RedirectToAuthModal />}
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
  accessToken: state.auth.accessToken,
  tokenExpiresAt: state.auth.tokenExpiresAt,
  isRedirecting: state.auth.isRedirecting,
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
