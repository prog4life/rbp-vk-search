import React from 'react';
import pt from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import FoundPost from './FoundPost';

function FoundPostsList({ posts }) {

  // TODO: No match with / Nothing found for "..." query

  if (!posts || posts.length === 0) {
    return (
      <ListGroup>
        <ListGroupItem style={{ textAlign: 'center' }}>
          {
            posts && posts.length === 0
              ? 'Nothing found'
              : 'No results yet' // posts === null
          }
        </ListGroupItem>
      </ListGroup>
    );
  }

  return (
    <ListGroup>
      {
        posts.map((post, index) => (
          <ListGroupItem key={post.id}>
            <FoundPost
              number={index + 1}
              post={post}
            />
          </ListGroupItem>
        ))
      }
    </ListGroup>
  );
}

FoundPostsList.propTypes = {
  posts: pt.arrayOf(pt.shape({
    id: pt.number.isRequired,
  })),
};

FoundPostsList.defaultProps = {
  posts: null,
};

export default FoundPostsList;
