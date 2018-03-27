import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';

const SearchControlButtons = ({ isSearchActive, onStopClick }) => (
  // <ButtonToolbar className="search-buttons">
  //   <Button
  //     bsStyle="info"
  //     disabled={isSearchActive}
  //     type="submit"
  //   >
  //     {isSearchActive ? 'Searching...' : 'Start Search'}
  //   </Button>
  //   {isSearchActive &&
  //     <Button onClick={onStopClick} type="button">
  //       {'Stop Search'}
  //     </Button>
  //   }
  // </ButtonToolbar>
  <ButtonToolbar className="search-buttons">
    {isSearchActive
      ?
        <Button
          onClick={onStopClick}
          type="button"
        >
          {'Stop Search'}
        </Button>
      :
        <Button
          bsStyle="info"
          type="submit"
        >
          {'Start Search'}
        </Button>
    }
  </ButtonToolbar>
);

SearchControlButtons.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  onStopClick: PropTypes.func.isRequired,
};

export default SearchControlButtons;
