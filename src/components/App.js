import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import fetchJsonp from 'fetch-jsonp';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';
import initialConfig from '../api/vk';
import {parseHash, handleErrorHash} from '../utils/res-hash-handler';
import * as AuthActions from '../actions/AuthActions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleWallGet = this.handleWallGet.bind(this);

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
    if (this.props.accessToken) {
      // TODO: check if token expires
      console.info('accessToken is already present: ', this.props.accessToken);
      return;
    }
    // console.info(vk);

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
      saveNewAccessToken,
      setTokenExpiry
    } = this.props.actions;

    const time = new Date();

    // this.setState({
    //   accessToken,
    //   tokenExpiresAt: time.setSeconds(time.getSeconds() + expiresIn),
    //   userId
    // }, () => console.info('New state after handling inc token: ', this.state));

    setUserId(userId);
    saveNewAccessToken(accessToken);
    setTokenExpiry(time.setSeconds(time.getSeconds() + expiresIn));
  }
  handleWallGet(inputValues) {
    console.log(inputValues);

    // const {wallOwner, wallDomain, searchQuery, authorId, searchOffset,
    //   postsAmount} = inputValues;
    // const apiCallUrl = `https://api.vk.com/method/wall.get?` +
    //   `owner_id=${wallOwner}&domain=${wallDomain}&offset=${searchOffset}` +
    //   `&count=${postsAmount}&access_token=${this.state.accessToken}` +
    //   `&v=${initialConfig.apiVersion}` +
    //   `&extended=1`;
    //
    // this.processCallsToAPI(false, apiCallUrl);

    this.findUserPosts(inputValues);
  }
  processCallsToAPI(apiCallUrl) {
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
      console.log('parsing failed', ex, 'ex name ', ex.name);
      // TODO: resolve, executes at the end
      return this.processCallsToAPI(apiCallUrl);
    });
  }
  findUserPosts(inputValues) {
    let searchResults = [];
    let {postsAmount} = inputValues;
    let offset = 0;
    let total = 1000;
    const authorId = Number(inputValues.authorId);
    const {wallOwner, wallDomain, searchQuery} = inputValues;
    const apiCallUrl = `https://api.vk.com/method/wall.get?` +
      `owner_id=${wallOwner}&domain=${wallDomain}&count=100` +
      `&access_token=${this.state.accessToken}` +
      `&v=${initialConfig.apiVersion}` +
      `&extended=1`;

    postsAmount = postsAmount || 10;

    // NOTE: for situation when user press "Start Search" button again
    clearInterval(this.userPostSearchIntervalId);
    // TODO: create external handler func and pass it to setInterval;
    // consider collecting all posts at first or some amount of posts and
    // search among them at the intervals end
    this.userPostSearchIntervalId = setInterval(() => {
      if (searchResults.length < postsAmount && offset < total) {
        const tempApiCallUrl = `${apiCallUrl}&offset=${offset}`;

        this.processCallsToAPI(tempApiCallUrl)
        .then((resJSON) => {
          const responseData = resJSON.response;
          // TODO: add stop condition when no more data
          // if (responseData.items.length = 0) {
          //   total = 0:
          // }
          const searchResultsChunk = responseData.items.filter((item) => {
            return item.from_id === authorId;
          });

          // TODO: add only if not empty
          searchResults = searchResults.concat(searchResultsChunk);
          this.setState({
            results: searchResultsChunk.length > 0
              ? searchResults
              : this.state.results
          });
          console.log('response from parsed json ', responseData);
          console.log('searchResultsChunk ', searchResultsChunk);
          total = responseData.count;
        })
        .catch((err) => console.warn(err));

        offset += 100;
        return;
      }
      // searchResults.length = 10; // FIXME: cut excess results
      clearInterval(this.userPostSearchIntervalId);
      console.log('userPostSearchResults: ', searchResults);
    }, 500);
  }
  render() {
    return (
      <div id="App">
        <SearchForm onSearch={this.handleWallGet} />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText={'looking'} />
          <ResultsList results={this.props.results} />
        </ResultsPanel>
      </div>
    );
  }
}

function mapState(state) {
  return {
    userId: state.userId,
    accessToken: state.accessToken,
    tokenExpiresAt: state.tokenExpiresAt,
    results: state.results
  };
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(App);
