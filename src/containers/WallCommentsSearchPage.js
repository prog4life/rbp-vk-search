import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  searchCommentsWithExecute, searchPostsWithExecute
} from 'actions';

import { tokenRequestURL } from 'config/common';

const getObjectFromJSON = response => response.json();

const throwIfNotOk = (response) => {
  if (response.error) {
    throw Error(response.error);
  }
  // if (!response.ok) {
  //   throw Error(response.statusText);
  // }
  return response;
};

const flattenResults = ({ response }) => {
  const posts = [];
  const receivedIds = response.ids;
  const receivedPosts = response.posts;

  const ids = receivedIds.reduce((accum, current, index) => {
    // posts = [...posts, ...receivedPosts[index]];
    [].push.apply(posts, receivedPosts[index]);
    return accum.concat(current);
  }, []);

  return {
    postsCount: response.postsCount,
    postsCountUpd: posts.length,
    postsCountByIds: ids.length,
    ids,
    posts
  };
};

const propTypes = {
  accessToken: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired
};

export class WallCommentsSearchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      response: null
    };
    this.handleCallAPIClick = this.handleCallAPIClick.bind(this);
  }
  componentDidMount() {
    const { accessToken, history } = this.props;

    if (!accessToken) {
      setTimeout(() => window.location.replace(tokenRequestURL), 3000);
    } else {
      console.log('access_token: ', accessToken);
    }
  }
  // getCommentsViaExecute
  handleCallAPIClick() {
    const { accessToken, dispatch } = this.props;

    // dispatch(searchCommentsWithExecute())
    searchPostsWithExecute(accessToken)
      .then(getObjectFromJSON)
      .then(throwIfNotOk)
      .then(flattenResults)
      .then(response => this.setState({ response }));
  }

  render() {
    const { response } = this.state;
    return (
      <div>
        <h3>{'Wall Comment Search Page'}</h3>
        <button onClick={this.handleCallAPIClick} type="button">
          {'Call API'}
        </button>
        <pre>
          <code>
            {JSON.stringify(response, null, 2)}
          </code>
        </pre>
      </div>
    );
  }
}

WallCommentsSearchPage.propTypes = propTypes;

const mapStateToProps = ({ accessToken }) => ({
  accessToken
});

// const WallCommentsSearchPage = () => (
//   <div>
//     <h3>{'Wall Comment Search Page'}</h3>
//     <pre>
//       <code>{}</code>
//     </pre>
//   </div>
// );

export default connect(mapStateToProps)(WallCommentsSearchPage);
