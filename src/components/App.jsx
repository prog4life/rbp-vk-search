import React from 'react';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';
import {clientID, display, redirectURI, scope, responseType, apiVersion,
  state, accessToken, tokenExpiresAt, userID, tokenRequestURL
} from '../vk/config';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterText: '',
      // temporary state part:
      clientID,
      display,
      redirectURI,
      scope,
      responseType,
      apiVersion,
      state,
      accessToken,
      tokenExpiresAt,
      // individual user id (vk user id)
      userID
    };
  }
  componentDidMount() {
    const localToken = localStorage.getItem('accessToken');

    if (localToken) {
      console.info('localToken ', localToken);
      return;
    }

    // const {clientID,
    //   display,
    //   redirectURI,
    //   scope,
    //   responseType,
    //   apiVersion,
    //   state} = this.state;

    console.info(this.state);
    console.warn(tokenRequestURL);

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
