import React from 'react';
import PropTypes from 'prop-types';

// import SearchControlButtons from 'components/SearchControlButtons';
import ProgressViewer from 'components/ProgressViewer';
import { ProgressBar, ButtonToolbar, Button } from 'react-bootstrap';

const SearchControls = ({
  isSearchActive,
  itemsName,
  processed,
  total,
  progress,
  onStopBtnClick,
}) => (
  // TODO: replace Fragment by container div with margin-bottom equal to
  // FormGroup margin-bottom ?
  <div className="search-controls">
    {/* <SearchControlButtons
      isSearchActive={isSearchActive}
      onStopClick={onStopBtnClick}
    /> */}
    <ButtonToolbar className="search-controls__search-buttons">
      {isSearchActive
        ?
          <Button onClick={onStopBtnClick} type="button">
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
    {isSearchActive &&
      <ProgressViewer className="search-controls__progress-viewer">
        {/* TODO: extract component ProgressTextInfo, change className to __progress-text */}
        <p className="progress-viewer__processed-info">
          {processed && total
            ? `Processed ${processed} of ${total} ${itemsName}`
            : 'Search in progress'
          }
        </p>
        <ProgressBar
          bsStyle="info"
          className="progress-viewer__progress-bar"
          label={Number.isFinite(progress) ? `${progress}%` : ''}
          now={progress || undefined}
        />
      </ProgressViewer>
    }
  </div>
);

// const preProgViewer = (
//   <div className="progress-viewer">
//     {/* TODO: extract component ProgressTextInfo, change className to __progress-text */}
//     <p className="progress-viewer__processed-info">
//       {processed && total
//         ? `Processed ${processed} of ${total} ${itemsName}`
//         : 'Search in progress'
//       }
//     </p>
//     <ProgressBar
//       bsStyle="info"
//       className="progress-viewer__progress-bar"
//       label={Number.isFinite(progress) ? `${progress}%` : ''}
//       now={progress || undefined}
//     />
//   </div>
// );

SearchControls.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  itemsName: PropTypes.string,
  onStopBtnClick: PropTypes.func.isRequired,
  processed: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  total: PropTypes.number,
};

SearchControls.defaultProps = {
  itemsName: 'items',
  // progress: null,
  total: null,
};

export default SearchControls;
