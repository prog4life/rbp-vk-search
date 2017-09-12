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
    console.info(parsedHash);

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
    }, () => console.info(this.state));
  }
  handleWallGet(inputValues) {
    console.log(inputValues);

    this.processCallsToAPI(false, 'wall.get', inputValues);
  }
  processCallsToAPI(execute, method, callParams) {
    const {wallOwner, wallDomain, searchQuery, authorId, searchOffset,
      postAmount} = callParams;
    const apiCallUrl = `https://api.vk.com/method/${method}?` +
      `owner_id=${wallOwner}&domain=${wallDomain}&offset=${searchOffset}` +
      `&count=${postAmount}&access_token=${this.state.accessToken}` +
      `&v=${init.apiVersion}`;

    fetchJsonp(apiCallUrl, {
      // to set custom callback param name (default - callback)
      // jsonpCallback: 'custom_callback',
      // to specify custom function name that will be used as callback,
      // default - jsonp_some-number
      // jsonpCallbackFunction: 'function_name_of_jsonp_response',
      // timeout: 3000 // default - 5000
    })
    .then((response) => response.json())
    .then((json) => {
      console.log('parsed json', json);
    })
    .catch((ex) => console.log('parsing failed', ex));
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
