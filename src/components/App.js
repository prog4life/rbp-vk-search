import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';
import { tokenRequestURL } from '../config/api';
import { parseHash, handleErrorHash } from '../utils/res-hash-handler';
import * as allActions from '../actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchInWallPosts = this.handleSearchInWallPosts.bind(this);
  }
  componentDidMount() {
    /* eslint max-statements: 0 */
    if (this.props.tokenData.token) {
      // TODO: check if token expires
      console.info('accessToken is already present: ', this.props.tokenData.token);
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

    const {
      setUserId,
      saveAccessTokenData
    } = this.props.actions;

    const expiry = Date.now() + (expiresIn * 1000);

    setUserId(userId);
    saveAccessTokenData(accessToken, expiry);
  }
  handleSearchInWallPosts(inputValues) {
    const { searchInWallPosts } = this.props.actions;

    searchInWallPosts(inputValues);
  }
  render() {
    return (
      <div id="App">
        <SearchForm onSearch={this.handleSearchInWallPosts} />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText="Here will be filter text" />
          <ResultsList results={this.props.results} />
        </ResultsPanel>
      </div>
    );
  }
}

function mapState(state) {
  return {
    // TODO: try to disconnect userId and tokenData and see what happens
    userId: state.userId,
    tokenData: state.tokenData,
    results: state.results
  };
}
// NOTE: wraps each action creator into a dispatch call, to be invoked directly
// as this.props.actName() instead of this.props.dispatch(actions.actionName())
function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(allActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(App);

App.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  tokenData: PropTypes.shape({
    token: PropTypes.string,
    expiresAt: PropTypes.number
  }).isRequired
};
