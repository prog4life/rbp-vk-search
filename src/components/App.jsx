import React from 'react';

import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';
import ResultsFilter from './ResultsFilter';
import ResultsList from './ResultsList';
import vk from '../vk/config';
import handleHash from '../helpers/url-hash-parser';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterText: '',
      // temporary state part? :
      accessToken: '',
      tokenExpiresAt: null,
      userID: null
    };
  }
  componentDidMount() {
    // const localToken = localStorage.getItem('accessToken');

    // if (localToken) {
    //   console.info('localToken ', localToken);
    //   return;
    // }
    
    const hash = document.location.hash.substr(1);
    
    const parsedHash = handleHash(hash);
    
    if (!parsedHash) {
      setInterval(() => {
        console.log('requesting new token');
        document.location.replace(vk.tokenRequestURL);
      }, 2000);
      return;
    }
    
    console.info(parsedHash);

    const {access_token, expires_in, user_id} = parsedHash;
    
    if(access_token) {
      let time = new Date();

      this.setState({
        accessToken: access_token,
        tokenExpiresAt: time.setSeconds(time.getSeconds() + expires_in),
        userID: user_id
      }, () => console.info(this.state));
    } else {
      console.warn(parsedHash);
    }

    // console.info(vk);

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
