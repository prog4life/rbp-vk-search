import React from 'react';
import PropTypes from 'prop-types';
import Spin from 'react-loader';

const propTypes = {
  spinAlignment: PropTypes.string,
  spinColor: PropTypes.string,
  spinConfig: PropTypes.objectOf(PropTypes.number),
};

const defaultProps = {
  spinAlignment: 'left',
  spinColor: '#fff',
  spinConfig: {
    length: 4,
    lines: 15,
    radius: 3,
    width: 2,
  },
};

const spinContainerStyle = {
  display: 'inline-block',
  height: '10px',
  position: 'relative',
  width: '16px',
};

function Spinner({ spinColor, spinConfig, spinAlignment, ...rest }) {
  const spinAlignmentStyle = {
    /* stylelint-disable */
    display: 'inline-block',
    float: `${spinAlignment} !important`,
  };

  return (
    <div style={spinAlignmentStyle} {...rest}>
      <div style={spinContainerStyle}>
        <Spin
          {...spinConfig}
          color={spinColor}
          loaded={false}
        />
      </div>
    </div>
  );
}

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;

export default Spinner;
