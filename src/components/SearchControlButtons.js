import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';

const SearchControlButtons = ({ isSearching, onStopClick }) => (
  <ButtonToolbar className="search-control-buttons">
    <Button
      bsStyle="info"
      disabled={isSearching}
      type="submit"
    >
      {isSearching ? 'Searching...' : 'Start Search'}
    </Button>
    {isSearching &&
      <Button onClick={onStopClick} type="button">
        {'Stop Search'}
      </Button>
    }
  </ButtonToolbar>
);

SearchControlButtons.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  onStopClick: PropTypes.func.isRequired
};

export default SearchControlButtons;
