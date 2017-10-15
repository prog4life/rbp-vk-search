import React from 'react';

function ResultsFilter({ filterText }) {
  return (
    <p>
      <span>Here will be search results filter with search query:</span>
      {filterText}
    </p>
  );
}

export default ResultsFilter;
