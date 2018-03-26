import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { getSortedPosts } from 'reducers';
import TopBar from 'components/TopBar';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';

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
      accessToken,
      parseAccessTokenHash,
      // redirectForToken,
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

    if (accessToken) {
      // TODO: check if accessToken expired
      console.info('accessToken is already present: ', accessToken);
      return;
    }

    // TODO: remove this temp redirect later and sign in at search start
    setTimeout(() => {
      // localStorage.setItem('url', tokenRequestURL);
      // redirectForToken(); // redirects to external vk api url
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
      startWallPostsSearch, checkAccessToken, redirectForToken,
    } = this.props;

    if (checkAccessToken()) {
      console.log('FORM STATE: ', inputData); // TEMP
      startWallPostsSearch(inputData);
      return;
    }
    // TODO: save input values to localStorage; show redirection notification
    redirectForToken();
  }
  handleSearchStop() {
    const { terminateSearch } = this.props;
    // TODO: check if search is active
    terminateSearch();
  }
  handleNavSelect(eventKey, e) {
    const { signOut } = this.props;
    if (eventKey === 1.2) {
      signOut();
      this.handleSearchStop();
    }
    console.log('Select: ', eventKey);
  }
  render() {
    const {
      search, posts, accessToken, userId, userName,
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
  accessToken: state.auth.accessToken,
  tokenExpiresAt: state.auth.tokenExpiresAt,
  results: state.results,
  posts: getSortedPosts(state),
  search: state.search,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

WallPostsSearch.propTypes = {
  accessToken: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  parseAccessTokenHash: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  search: PropTypes.shape({
    isActive: PropTypes.bool,
    total: PropTypes.number,
    processed: PropTypes.number,
    progress: PropTypes.number,
  }).isRequired,
  signOut: PropTypes.func.isRequired,
  startWallPostsSearch: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired,
  // tokenExpiresAt: PropTypes.number.isRequired
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearch);
