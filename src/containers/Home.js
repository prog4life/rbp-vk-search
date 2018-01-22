import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { parseAccessTokenHash } from 'actions';
// import { parseHash, handleErrorHash } from 'utils/res-hash-handler';
import HomePage from 'components/HomePage';

class Home extends Component {
  /* eslint react/require-optimization: 0 */
  componentDidMount() {
    const {
      accessToken, history, location, match, parseAccessTokenHash
    } = this.props;
    /* eslint max-statements: 0 */

    // const hash = document.location.hash.substr(1);
    // const parsedHash = parseHash(location.hash.substr(1));
    parseAccessTokenHash(location.hash.substr(1));

    console.log('match obj ', match);
    console.log('location obj ', location);

    history.replace(match.path);

    if (accessToken) {
      console.info('existing accessToken: ', accessToken);
    }
  }
  render() {
    const { accessToken } = this.props;
    // TODO: when redirect_uri will be changed to '/auth', redirect to "/"
    // TODO: check if accessToken expires
    return accessToken
      ? <Redirect push to="/wall-comments" />
      : <HomePage />;
  }
}

Home.propTypes = {
  accessToken: PropTypes.string.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  parseAccessTokenHash: PropTypes.func.isRequired
  // tokenExpiresAt: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  accessToken: state.accessToken
});

export default connect(mapStateToProps, { parseAccessTokenHash })(Home);
