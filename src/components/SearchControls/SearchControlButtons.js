import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import SpinnerButton from 'components/common/SpinnerButton';

const SearchControlButtons = ({ isSearchActive, onStopClick }) => {
  const startButton = (
    <Button
      bsStyle="info"
      type="submit"
    >
      {'Start Search'}
    </Button>
  );
  const stopButton = (
    <SpinnerButton
      loading={!isSearchActive}
      disabled={false}
      bsStyle="default"
      spinColor="#000"
      onClick={onStopClick}
      type="button"
    >
      {'Stop Search'}
    </SpinnerButton>
  );

  return (
    <ButtonToolbar className="search-controls__button-toolbar">
      {/* TEMP add ! to test button with loader */}
      {!isSearchActive
        ? stopButton
        : startButton
      }
    </ButtonToolbar>
    // <ButtonToolbar className="search-controls__button-toolbar">
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
  );
};

SearchControlButtons.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  onStopClick: PropTypes.func.isRequired,
};

export default SearchControlButtons;
