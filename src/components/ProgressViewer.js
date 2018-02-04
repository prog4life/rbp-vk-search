import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';

const ProgressViewer = ({ now, numOfProcessed, totalAmount, itemsName }) => (
  <ProgressBar
    bsStyle="info"
    className="progress-viewer"
    label={`${now}%`}
    now={now}
  />
);

ProgressViewer.propTypes = {
  itemsName: PropTypes.string,
  now: PropTypes.number
};

ProgressViewer.defaultProps = {
  itemsName: 'posts',
  now: 0
};

export default ProgressViewer;
