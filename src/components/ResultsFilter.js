import React from 'react';

function ResultsFilter({ filterText }) {
  return (
    <div>
      <span>Here will be search results filter with search query:</span>
      {filterText}
    </div>
  );
}

export default ResultsFilter;
