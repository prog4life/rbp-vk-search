import React from 'react';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterText: '',
      // temporary state part:
      clientID: 5931563,
      display: 'popup',
      redirectURI: 'https://main-dev2get.c9users.io',
      // redirectURI: 'https://nameless-sea-73563.herokuapp.com',
      scope: 'friends',
      responseType: 'token',
      apiVersion: 5.62,
      state: 55555,
      authData: null,
      accessToken: '',
      tokenExpiresAt: null,
      // TODO: choose one
      // serverTokenURL: 'https://main-dev2get.c9users.io/auth',
      // serverTokenURL: 'https://nameless-sea-73563.herokuapp.com/auth',
      // individual user id (vk user id)
      userID: null
    };
  }
  componentDidMount() {
    const localToken = localStorage.getItem('accessToken');

    if (localToken) {
      console.warn('localToken ', localToken);
      return;
    }

    const {clientID,
      display,
      redirectURI,
      scope,
      responseType,
      apiVersion,
      state} = this.state;

    const requestURL = `https://oauth.vk.com/authorize?client_id=${clientID}&` +
        `display=${display}&redirect_uri=${redirectURI}&` +
        `scope=${scope}&response_type=${responseType}&` +
        `v=${apiVersion}&state=${state}`;

    // fetch(requestURL, {
    //   method: 'GET',
    //   mode: 'same-origin'
    // }).then((response) => console.warn('vk api response ', response))
    // .catch((error) => console.error('vk api returned error', error));
    // document.location.replace(requestURL);
  }
  render() {
    return (
      <div id="App">
        <SearchForm />
        <ResultsPanel header="This is a panel with search results">
          <ResultsFilter filterText={'looking'} />
          <ResultsList results={this.props.results} />
        </ResultsPanel>
      </div>
    );
  }
}

export default App;
