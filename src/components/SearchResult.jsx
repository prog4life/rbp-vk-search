import React from 'react';
import {ListGroupItem} from 'react-bootstrap';

function SearchResult({result, number}) {
  const {postId, fromId, text, link} = result;

  return (
    <ListGroupItem>
      <span>{postId} </span>
      <span>{fromId} </span>
      <span>{text} </span>
      <span>{link}</span>
    </ListGroupItem>
  );
}

export default SearchResult;
