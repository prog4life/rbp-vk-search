import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import SearchControlButtons from 'components/SearchControlButtons';
import ProgressViewer from 'components/ProgressViewer';

const SearchControls = ({
  isSearchActive,
  processed,
  total,
  progress,
  onStopBtnClick
}) => (
  <Fragment>
    <SearchControlButtons
      isSearching={isSearchActive}
      onStopClick={onStopBtnClick}
    />
    {isSearchActive &&
      <ProgressViewer
        now={progress}
        processedCount={processed}
        total={total}
      />
    }
  </Fragment>
);

SearchControls.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  onStopBtnClick: PropTypes.func.isRequired,
  processed: PropTypes.number.isRequired,
  progress: PropTypes.number,
  total: PropTypes.number
};

export default SearchControls;
