import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { getSortedPosts, getSearchIsActive, getAccessToken } from 'selectors';
import TopBarContainer from 'containers/TopBarContainer';
import PostsSearchForm from 'components/PostsSearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsList from 'components/ResultsList';
import ResultsFilter from 'components/SearchResultsFilter';
import DelayedRender from 'components/common/DelayedRender';
import ErrorBoundary from 'components/common/ErrorBoundary';
import RedirectToAuthModal from 'components/RedirectToAuthModal';

// import ResultsListContainer from 'containers/ResultsListContainer';

class WallPostsSearch extends React.Component {
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

    if (isSearchActive) {
      terminateSearch();
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
    } = this.props;

    return (
      <div className="wall-posts-search">
        <TopBarContainer />
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
        <PostsSearchForm
          isSearchActive={isSearchActive}
          onStartSearch={this.handleSearchStart}
        />
        <ResultsPanel heading={<ResultsFilter />}>
          <ResultsList results={posts} />
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
  posts: getSortedPosts(state),
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
  isRedirecting: PropTypes.bool.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  offerAuthRedirect: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object),
  redirectToAuth: PropTypes.func.isRequired,
  // signOut: PropTypes.func.isRequired,
  startWallPostsSearch: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
};

WallPostsSearch.defaultProps = {
  accessToken: null,
  posts: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearch);
