import React from 'react';
import {ListGroup} from 'react-bootstrap';
import SearchResult from './SearchResult';

function ResultsList({results}) {
  const [result1, result2] = results;

  return (
    <ListGroup>
      <SearchResult number="1" result={result1} />
      <SearchResult number="2" result={result2} />
    </ListGroup>
  );
}

export default ResultsList;
