import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { setUserId, saveAccessTokenData } from 'actions';
import { parseHash, handleErrorHash } from 'utils/res-hash-handler';
import HomePage from 'components/HomePage';

class Auth extends Component {
  /* eslint react/require-optimization: 0 */
  componentDidMount() {
    const {
      tokenData: { token },
      history,
      location,
      match,
      setUserId,
      saveAccessTokenData
    } = this.props;
    /* eslint max-statements: 0 */

    // const hash = document.location.hash.substr(1);
    const parsedHash = parseHash(location.hash.substr(1));

    console.log('match obj ', match);
    console.log('location obj ', location);
    console.info('parsedHash: ', parsedHash);

    if (parsedHash.access_token) {
      const {
        access_token: accessToken,
        expires_in: expiresIn,
        user_id: userId
      } = parsedHash;

      // const expiry = Date.now() + (expiresIn * 1000);
      const expiry = moment().add(expiresIn, 'seconds').unix();

      setUserId(userId);
      saveAccessTokenData(accessToken, expiry);
    } else if (parsedHash.error) {
      handleErrorHash(parsedHash);
    }

    // TODO: try replaceState
    // NOTE: document.location.hash = ''; was used before
    // history.pushState('', document.title, document.location.pathname);
    history.replace(match.path);

    // TODO: check if token expires
    if (token) {
      console.info('existing accessToken: ', token);
    }
    console.info('received accessToken: ', parsedHash.access_token);
    // when redirect_uri will be changed to '/auth', redirect to "/"
  }
  render() {
    const { tokenData: { token } } = this.props;
    return token ? <Redirect push to="/wall-posts" /> : <HomePage />;
  }
}

Auth.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  saveAccessTokenData: PropTypes.func.isRequired,
  setUserId: PropTypes.func.isRequired,
  tokenData: PropTypes.shape({
    token: PropTypes.string,
    expiresAt: PropTypes.number
  }).isRequired
};

const mapStateToProps = state => ({
  tokenData: state.tokenData
});

export default connect(
  mapStateToProps,
  { setUserId, saveAccessTokenData }
)(Auth);
