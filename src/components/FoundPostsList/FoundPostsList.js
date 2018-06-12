import React from 'react';
import pt from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
// import uuidv1 from 'uuid/v1';
import FoundPost from './FoundPost';

const renderResultsList = results => (
  results.map((result, index) => (
    // TODO: replace key by post_id
    <ListGroupItem key={result.id}>
      <FoundPost
        number={index + 1}
        result={result}
      />
    </ListGroupItem>
  ))
);

function FoundPostsList({ posts }) {
  const noResultsItem = (
    <ListGroupItem style={{ textAlign: 'center' }}>
      {'No results yet'}
    </ListGroupItem>
  );

  return (
    <ListGroup>
      {posts && posts.length // TODO: show different message on null and []
        ? renderResultsList(posts)
        : noResultsItem
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
