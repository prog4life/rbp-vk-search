import React from 'react';
import {ListGroup} from 'react-bootstrap';
import uuidv1 from 'uuid/v1';
import SearchResult from './SearchResult';

function ResultsList({results}) {
  const [result1, result2] = results;

  return (
    <ListGroup>
      {/* <SearchResult number="1" result={result1} /> */}
      {/* <SearchResult number="2" result={result2} /> */}
      {results.map((result, index) => (
        <SearchResult
          key={uuidv1()}
          number={++index}
          result={result}
        />
      ))}
    </ListGroup>
  );
}

export default ResultsList;
