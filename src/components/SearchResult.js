import React from 'react';
import { ListGroupItem } from 'react-bootstrap';

function SearchResult({ result, number }) {
  const {
    timestamp, fromId, text, link
  } = result;

  return (
    <ListGroupItem>
      <span>[{number}] </span>
      <span className="post-timestamp">
        {new Date(timestamp).toLocaleString()}
      </span>
      <span>{' '}
        <a href={`https://vk.com/id${fromId}`} target="_blank">
          [id{fromId}]
        </a>
      </span>
      <p>
        {text}{' '}
        <a href={link} target="_blank">Link to post at wall</a>
      </p>
    </ListGroupItem>
  );
}

export default SearchResult;
