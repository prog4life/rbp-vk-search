import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';

const ProgressViewer = ({ now, processedCount, total, itemsName }) => (
  <div className="progress-viewer">
    <p className="progress-viewer__processed-info">
      {processedCount && total // will not display 0 of n
        ? `Processed ${processedCount} of ${total} ${itemsName}`
        : 'Search in progress'
      }
    </p>
    <ProgressBar
      bsStyle="info"
      className="progress-viewer__progress-bar"
      label={Number.isFinite(now) ? `${now}%` : ''}
      now={Number.isFinite(now) ? now : undefined}
    />
  </div>
);

ProgressViewer.propTypes = {
  itemsName: PropTypes.string,
  now: PropTypes.number,
  processedCount: PropTypes.number.isRequired,
  total: PropTypes.number
};

ProgressViewer.defaultProps = {
  itemsName: 'posts',
  now: null,
  total: null
};

export default ProgressViewer;
