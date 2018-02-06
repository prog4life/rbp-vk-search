import React from 'react';
import { ListGroup } from 'react-bootstrap';
import uuidv1 from 'uuid/v1';
import SearchResult from './SearchResult';

function ResultsList({ results }) {
  return (
    <ListGroup>
      {/* <SearchResult number="1" result={result1} /> */}
      {/* <SearchResult number="2" result={result2} /> */}
      {results.map((result, index) => (
        <SearchResult
          key={uuidv1()} // TODO: replace by post_id
          number={index + 1}
          result={result}
        />
      ))}
    </ListGroup>
  );
}

export default ResultsList;
