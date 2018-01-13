import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as actionCreators from 'actions';
import { tokenRequestURL } from 'config/api';
import SearchForm from 'components/SearchForm';
import ResultsPanel from 'components/ResultsPanel';
import ResultsFilter from 'components/ResultsFilter';
import ResultsList from 'components/ResultsList';

class WallPostsSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchForWallPosts = this.handleSearchForWallPosts.bind(this);
    this.handleSearchStop = this.handleSearchStop.bind(this);
  }
  componentDidMount() {
    const { accessToken, location, match } = this.props;

    if (accessToken) {
      // TODO: check if accessToken expires
      console.info('accessToken is already present: ', accessToken);
      return;
    }

    console.log('match obj ', match);
    console.log('location obj ', location);

    // TODO: remove this temp redirect later and sign in at search start
    if (!accessToken) {
      setTimeout(() => {
        const result = window.confirm('You must be logged in your vk account' +
          ' to perform search. Do you want to Sign In now?');
        if (result) {
          window.location.replace(tokenRequestURL);
        }
      }, 3000);
    }
  }
  handleSearchForWallPosts(inputValues) {
    const { actions: { searchPostsOnWall } } = this.props;
    searchPostsOnWall(inputValues);
  }
  handleSearchStop() {
    const { actions: { finishSearch } } = this.props;
    finishSearch();
  }
  render() {
    const { isSearching, results } = this.props;
    return (
      <div id="App">
        <SearchForm
          isSearching={isSearching}
          onStartSearch={this.handleSearchForWallPosts}
          onTerminateSearch={this.handleSearchStop}
        />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText="Here will be filter text" />
          <ResultsList results={results} />
        </ResultsPanel>
      </div>
    );
  }
}

WallPostsSearchPage.propTypes = {
  accessToken: PropTypes.string.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  isSearching: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired
  // tokenExpiresAt: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    userId: state.userId,
    accessToken: state.accessToken,
    tokenExpiresAt: state.tokenExpiresAt,
    results: state.results,
    isSearching: state.isSearching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WallPostsSearchPage);
