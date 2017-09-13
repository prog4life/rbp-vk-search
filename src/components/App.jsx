import React from 'react';
import fetchJsonp from 'fetch-jsonp';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';
import init from '../vk/params';
import {parseHash, handleErrorHash} from '../helpers/res-hash-handler';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleWallGet = this.handleWallGet.bind(this);

    this.state = {
      results: [],
      filterText: '',
      // temp part of state? :
      accessToken: '',
      tokenExpiresAt: null,
      userId: null
    };
  }
  componentDidMount() {
    if (this.state.accessToken) {
      // TODO: check if token expires
      console.info('accessToken is already present: ', this.state.accessToken);
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
        document.location.replace(init.tokenRequestURL);
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
    const time = new Date();

    this.setState({
      accessToken,
      tokenExpiresAt: time.setSeconds(time.getSeconds() + expiresIn),
      userId
    }, () => console.info('New state after handling inc token: ', this.state));
  }
  handleWallGet(inputValues) {
    console.log(inputValues);

    // const {wallOwner, wallDomain, searchQuery, authorId, searchOffset,
    //   postsAmount} = inputValues;
    // const apiCallUrl = `https://api.vk.com/method/wall.get?` +
    //   `owner_id=${wallOwner}&domain=${wallDomain}&offset=${searchOffset}` +
    //   `&count=${postsAmount}&access_token=${this.state.accessToken}` +
    //   `&v=${init.apiVersion}` +
    //   `&extended=1`;
    //
    // this.processCallsToAPI(false, apiCallUrl);

    this.findUserPosts(inputValues);
  }
  processCallsToAPI(execute, apiCallUrl) {
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
    .catch((ex) => console.log('parsing failed', ex));
  }
  findUserPosts(inputValues) {
    let searchResult = [];
    let {postsAmount} = inputValues;
    let offset = 0;
    let overall = 100;
    const {wallOwner, wallDomain, searchQuery, authorId} = inputValues;
    const apiCallUrl = `https://api.vk.com/method/wall.get?` +
      `owner_id=${wallOwner}&domain=${wallDomain}&count=100` +
      `&access_token=${this.state.accessToken}` +
      `&v=${init.apiVersion}` +
      `&extended=1`;

    postsAmount = postsAmount || 10;

    // TODO: create external handler func and pass it to setInterval;
    // consider collecting all posts at first or some amount of posts and
    // search among them at the intervals end
    this.userPostSearchIntervalId = setInterval(() => {
      if (searchResult.length < postsAmount && offset < overall) {
        const tempApiCallUrl = `${apiCallUrl}&offset=${offset}`;

        this.processCallsToAPI(false, tempApiCallUrl)
        .then((resJSON) => {
          const responseData = resJSON.response;
          // TODO: add stop condition when no more data
          // if (responseData.items.length = 0) {
          //   overall = 0:
          // }
          const searchResultChunk = responseData.items.filter((item) => {
            // TODO: convert to number outside of interval func
            return item.from_id === Number(authorId);
          });
          // TODO: add only if not empty
          searchResult = searchResult.concat(searchResultChunk);
          console.log('response from parsed json ', responseData);
          console.log('searchResultChunk ', searchResultChunk);
          offset += 100;
          overall = responseData.count;
        })
        .catch((err) => console.warn(err));
        return;
      }
      // searchResult.length = 10; // FIXME: cut excess results
      clearInterval(this.userPostSearchIntervalId);
      console.log('userPostSearchResult: ', searchResult);
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

export default App;
