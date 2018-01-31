import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { tokenRequestURL } from 'config/common';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';

const propTypes = {
  accessToken: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  isSearching: PropTypes.bool.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  parseAccessTokenHash: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchPostsAtWall: PropTypes.func.isRequired,
  terminateSearch: PropTypes.func.isRequired
  // tokenExpiresAt: PropTypes.number.isRequired
};

class WallPostsSearch extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchForWallPosts = this.handleSearchForWallPosts.bind(this);
    this.handleSearchStop = this.handleSearchStop.bind(this);
  }
  componentDidMount() {
    const {
      accessToken,
      parseAccessTokenHash,
      location,
      match,
      history
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
      window.location.replace(tokenRequestURL); // req to external vk api url
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
  handleSearchForWallPosts(inputValues) {
    const { searchPostsAtWall } = this.props;
    searchPostsAtWall(inputValues);
    // TEMP:
    console.log('FORM STATE: ', inputValues);
  }
  handleSearchStop() {
    // NOTE: optionally can get results from props and pass them as arg
    const { terminateSearch } = this.props;
    terminateSearch();
  }
  render() {
    const { isSearching, results } = this.props;
    return (
      <div className="wall-posts-search">
        <SearchForm
          isSearching={isSearching}
          onStartSearch={this.handleSearchForWallPosts}
          onStopSearch={this.handleSearchStop}
        />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText="Here will be filter text" />
          <ResultsList results={results} />
        </ResultsPanel>
      </div>
    );
  }
}

WallPostsSearch.propTypes = propTypes;

const mapStateToProps = state => ({
  userId: state.userId,
  accessToken: state.accessToken,
  tokenExpiresAt: state.tokenExpiresAt,
  results: state.results,
  isSearching: state.isSearching
});

const mapDispatchToProps = dispatch => (
  bindActionCreators(actionCreators, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearch);
