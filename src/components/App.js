import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import fetchJsonp from 'fetch-jsonp';
import PropTypes from 'prop-types';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';
import initialConfig from '../api/initial';
import {parseHash, handleErrorHash} from '../utils/res-hash-handler';
import * as allActions from '../actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleUserPostsSearch = this.handleUserPostsSearch.bind(this);

    // this.state = {
    //   results: [
    //     {
    //       date: 132357458,
    //       from_id: 247772351,
    //       text: 'Я ищу спонсора на длительные отношения, я без опыта, ' +
    //       'полненькая но не сильно, общительная. Пишите в л/с',
    //       link: 'https://vk.com/club75465366?w=wall-75465366_37824%2Fall'
    //     }
    //   ],
    //   filterText: '',
    //   // temp part of state? :
    //   accessToken: '',
    //   tokenExpiresAt: null,
    //   userId: null
    // };
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

    // TODO: try pushState or replaceState
    // document.location.hash = '';
    history.pushState('', document.title, document.location.pathname);

    // TODO: remove this temp redirect later and try sign in on search start
    if (!parsedHash) {
      setInterval(() => {
        document.location.replace(initialConfig.tokenRequestURL);
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

    const date = new Date();
    const expiry = date.setSeconds(date.getSeconds() + expiresIn);

    setUserId(userId);
    saveAccessTokenData(accessToken, expiry);
  }
  makeCallToAPI(apiCallUrl) {
    console.log('api call url: ', apiCallUrl);

    return fetchJsonp(apiCallUrl, {
      // to set custom callback param name (default - callback)
      // jsonpCallback: 'custom_callback',
      // to specify custom function name that will be used as callback,
      // default - jsonp_some-number
      // jsonpCallbackFunction: 'function_name_of_jsonp_response',
      // timeout: 3000 // default - 5000
    })
    .then((response) => response.json())
    // .then((json) => {
    //   const responseData = json.response;
    //
    //   console.log('response from parsed json', responseData);
    //   return responseData;
    // })
    .catch((ex) => {
      console.log('parsing failed', ex);
      // TODO: resolve, executes at the end
      return this.makeCallToAPI(apiCallUrl);
    });
  }
  handleUserPostsSearch(inputValues) {
    const {findUserPostsAtWall} = this.props.actions;

    findUserPostsAtWall(inputValues);
  }
  render() {
    return (
      <div id="App">
        <SearchForm onSearch={this.handleUserPostsSearch} />
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
