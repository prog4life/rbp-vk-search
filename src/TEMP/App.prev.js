import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as actionCreators from 'actions';
import { tokenRequestURL } from 'config/common';
import { parseHash, handleErrorHash } from 'utils/res-hash-handler';
import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchForWallPosts = this.handleSearchForWallPosts.bind(this);
    this.handleSearchStop = this.handleSearchStop.bind(this);
  }
  componentDidMount() {
    /* eslint max-statements: 0 */
    if (this.props.accessToken) {
      // TODO: check if accessToken expires
      console.info('accessToken is already present: ', this.props.accessToken);
      return;
    }

    const hash = document.location.hash.substr(1);
    const parsedHash = parseHash(hash);

    // TODO: try replaceState
    // NOTE: document.location.hash = ''; was used before
    history.pushState('', document.title, document.location.pathname);

    // TODO: remove this temp redirect later and try sign in on search start
    if (!parsedHash) {
      setInterval(() => {
        document.location.replace(tokenRequestURL);
      }, 2000);
    }

    if (parsedHash.access_token) {
      this.handleIncomingToken(parsedHash);
    } else if (parsedHash.error) {
      handleErrorHash(parsedHash);
    }
  }
  handleIncomingToken(parsedHash) {
    console.info('parsedHash: ', parsedHash);

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      user_id: userId
    } = parsedHash;

    const { actions: { setUserId, saveAccessToken } } = this.props;

    // const tokenExpiresAt = Date.now() + (expiresIn * 1000);
    const tokenExpiresAt = moment().add(expiresIn, 'seconds').unix();

    setUserId(userId);
    saveAccessToken(accessToken, tokenExpiresAt);
  }
  handleSearchForWallPosts(inputValues) {
    const { actions: { searchPostsOnWall } } = this.props;
    searchPostsOnWall(inputValues);
  }
  handleSearchStop() {
    const { actions: { terminateSearch } } = this.props;
    terminateSearch();
  }
  render() {
    const { isSearching, results } = this.props;
    return (
      <div id="app">
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

App.propTypes = {
  accessToken: PropTypes.string.isRequired,
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  isSearching: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  tokenExpiresAt: PropTypes.number.isRequired
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
// NOTE: wraps each action creator into a dispatch call, to be invoked directly
// as this.props.actName() instead of this.props.dispatch(actions.actionName())
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
