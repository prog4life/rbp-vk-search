import React from 'react';
import pt from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import FoundPostContainer from 'containers/FoundPostContainer';

function FoundPostsListOptim({ postIds }) {
  // TODO: No match with / Nothing found for "..." query

  if (!postIds || postIds.length === 0) {
    return (
      <ListGroup>
        <ListGroupItem style={{ textAlign: 'center' }}>
          {
            postIds && postIds.length === 0
              ? 'Nothing found'
              : 'No results yet' // postIds === null
          }
        </ListGroupItem>
      </ListGroup>
    );
  }

  // console.log('FoundPostsListOptim, postIds: ', postIds);

  return (
    <ListGroup>
      {
        postIds.map((postId, index) => (
          <ListGroupItem key={postId}>
            <FoundPostContainer
              number={index + 1}
              postId={postId}
            />
          </ListGroupItem>
        ))
      }
    </ListGroup>
  );
}

FoundPostsListOptim.propTypes = {
  postIds: pt.arrayOf(pt.number.isRequired),
};

FoundPostsListOptim.defaultProps = {
  postIds: null,
};

export default FoundPostsListOptim;
