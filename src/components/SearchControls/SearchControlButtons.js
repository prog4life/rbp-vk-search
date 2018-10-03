import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import SpinnerButton from 'components/SpinnerButton';

const SearchControlButtons = ({ isSearchActive, onStopClick }) => {
  const startButton = (
    <Fragment>
      <Button
        onClick={onStopClick}
        type="button"
      >
        {'Stop Search'}
      </Button>
      <SpinnerButton
        loading={!isSearchActive}
        disabled={false}
        bsStyle="default"
        spinColor="#000"
      >
        {'Stop Search'}
      </SpinnerButton>
    </Fragment>
  );
  const stopButton = (
    <Button
      bsStyle="info"
      type="submit"
    >
      {'Start Search'}
    </Button>
  );

  return (
    <ButtonToolbar className="search-controls__button-toolbar">
      {/* TEMP changed to ! */}
      {!isSearchActive
        ? startButton
        : stopButton
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
