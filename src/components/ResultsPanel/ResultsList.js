import React from 'react';
import pt from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
// import uuidv1 from 'uuid/v1';
import SearchResult from './SearchResult';

const renderResultsList = results => (
  results.map((result, index) => (
    // TODO: replace key by post_id
    <ListGroupItem key={result.id}>
      <SearchResult
        number={index + 1}
        result={result}
      />
    </ListGroupItem>
  ))
);

function ResultsList({ results }) {
  const noResultsItem = (
    <ListGroupItem style={{ textAlign: 'center' }}>
      {'No results yet'}
    </ListGroupItem>
  );

  return (
    <ListGroup>
      {results && results.length // TODO: show different message on null and []
        ? renderResultsList(results)
        : noResultsItem
      }
    </ListGroup>
  );
}

ResultsList.propTypes = {
  results: pt.arrayOf(pt.shape({
    id: pt.number.isRequired,
  })),
};

ResultsList.defaultProps = {
  results: null,
};

export default ResultsList;
