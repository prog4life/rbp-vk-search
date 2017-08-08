import React from 'react';
import {ListGroupItem} from 'react-bootstrap';

function SearchResult({result, number}) {
  const {postId, fromId, text, link} = result;

  return (
    <ListGroupItem>
      <span>{postId} </span>
      <span>{fromId} </span>
      <span>{text} </span>
      <a href={link} target="_blank">Link to post at wall</a>
    </ListGroupItem>
  );
}

export default SearchResult;
