import React from 'react';
import {ListGroupItem} from 'react-bootstrap';

function SearchResult({result, number}) {
  const {content, link} = result;

  return (
    <ListGroupItem>
      <span>{number}</span>
      <span>{content}</span>
      <span>{link}</span>
    </ListGroupItem>
  );
}

export default SearchResult;
