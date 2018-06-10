import React from 'react';
import PropTypes from 'prop-types';

const SearchStatus = ({
  isActive, isCompleted, processed, total, name,
}) => {
  let message = '';

  switch (true) {
    case (!isActive && !isCompleted):
      break;
    case (total === 0):
      message = `No ${name} to search`;
      break;
    case (!total || !Number.isInteger(processed)):
      message = 'Search in progress';
      break;
    default:
      message = `Processed ${processed} of ${total} ${name}`;
      break;
  }

  return (
    <p className="search-status">
      {message}
    </p>
  );
};

SearchStatus.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  name: PropTypes.string,
  processed: PropTypes.number.isRequired,
  total: PropTypes.number,
};

SearchStatus.defaultProps = {
  name: 'items',
  total: null,
};

export default SearchStatus;
