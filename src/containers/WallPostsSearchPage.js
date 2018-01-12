import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as actionCreators from 'actions';
import { tokenRequestURL } from 'config/api';
import { parseHash, handleErrorHash } from 'utils/res-hash-handler';
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
    const { tokenData: { token }, location, history, match } = this.props;
    /* eslint max-statements: 0 */
    if (token) {
      // TODO: check if token expires
      console.info('accessToken is already present: ', token);
      return;
    }

    // const hash = document.location.hash.substr(1);
    // const parsedHash = parseHash(location.hash.substr(1));

    console.log('match obj ', match);
    console.log('location obj ', location);

    // TODO: remove this temp redirect later and sign in at search start
    if (!token) {
      setTimeout(() => {
        const result = window.confirm('You must be logged in your vk account' +
          'to perform search. Do you want to Sign In now?');
        if (result) {
          window.location.replace(tokenRequestURL);
        }
      }, 3000);
    }

    // if (parsedHash.access_token) {
    //   this.handleIncomingToken(parsedHash);
    // } else if (parsedHash.error) {
    //   handleErrorHash(parsedHash);
    // }

    // TODO: try replaceState
    // NOTE: document.location.hash = ''; was used before
    // history.pushState('', document.title, document.location.pathname);
    // history.replace(match.path);
  }
  handleIncomingToken(parsedHash) {
    console.info('parsedHash: ', parsedHash);

    const {
      access_token: accessToken,
      expires_in: expiresIn,
      user_id: userId
    } = parsedHash;

    const { actions: { setUserId, saveAccessTokenData } } = this.props;

    // const expiry = Date.now() + (expiresIn * 1000);
    const expiry = moment().add(expiresIn, 'seconds').unix();

    setUserId(userId);
    saveAccessTokenData(accessToken, expiry);
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
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  isSearching: PropTypes.bool.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  tokenData: PropTypes.shape({
    token: PropTypes.string,
    expiresAt: PropTypes.number
  }).isRequired
};

function mapStateToProps(state) {
  return {
    userId: state.userId,
    tokenData: state.tokenData,
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

export default connect(mapStateToProps, mapDispatchToProps)(WallPostsSearchPage);
