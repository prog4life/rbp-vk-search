import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { ProgressBar } from 'react-bootstrap';

const ProgressViewer = ({ children, className }) => (
  <div className={classNames('progress-viewer', className)}>
    {children}
  </div>
);

ProgressViewer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ProgressViewer.defaultProps = {
  className: '',
};

// const ProgressViewer = ({ progress, processed, total, itemsName }) => (
//   <div className="progress-viewer">
//     {/* TODO: extract component ProgressTextInfo, change className to __progress-text */}
//     <p className="search-status">
//       {processed && total
//         ? `Processed ${processed} of ${total} ${itemsName}`
//         : 'Search in progress'
//       }
//     </p>
//     <ProgressBar
//       bsStyle="info"
//       className="progress-viewer__progress-bar"
//       label={progress ? `${progress}%` : ''}
//       now={progress || undefined}
//     />
//   </div>

// ProgressViewer.propTypes = {
//   itemsName: PropTypes.string,
//   processed: PropTypes.number.isRequired,
//   progress: PropTypes.number.isRequired,
//   total: PropTypes.number
// };

// ProgressViewer.defaultProps = {
//   itemsName: 'items',
//   // progress: null,
//   total: null
// };

export default ProgressViewer;
