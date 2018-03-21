import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { tokenRequestURL } from 'config/common';
import TopBar from 'components/TopBar';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';

import ResultsListContainer from 'containers/ResultsListContainer';

const propTypes = {
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
      // window.location.replace(tokenRequestURL); // req to external vk api url
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
    const { startWallPostsSearch } = this.props;
    startWallPostsSearch(inputData);
    // TEMP:
    console.log('FORM STATE: ', inputData);
  }
  handleSearchStop() {
    // NOTE: optionally can get results from props and pass them as arg
    const { terminateSearch } = this.props;
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
      search, results, accessToken, userId, userName,
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
          onStopSearch={this.handleSearchStop}
          // search={search}
        />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText="Here will be filter text" />
          <ResultsList results={results} />
          {/* <ResultsListContainer /> */}
        </ResultsPanel>
      </div>
    );
  }
}

WallPostsSearch.propTypes = propTypes;

const mapStateToProps = state => ({
  userId: state.userId,
  userName: state.userName,
  accessToken: state.accessToken,
  tokenExpiresAt: state.tokenExpiresAt,
  results: state.results,
  search: state.search,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearch);
