import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Spinner from './Spinner';

const propTypes = {
  bsStyle: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  loading: PropTypes.bool.isRequired,
  spinAlignment: PropTypes.string,
  spinColor: PropTypes.string,
};

const defaultProps = {
  bsStyle: 'default',
  children: null,
  disabled: null,
  icon: null,
  spinAlignment: 'left',
  spinColor: '#fff',
};

function SpinnerButton({
  bsStyle,
  children,
  disabled,
  icon,
  loading = false,
  spinColor,
  spinAlignment,
  ...rest
}) {
  const isDisabled = typeof disabled === 'boolean' ? disabled : loading;

  return (
    <Button bsStyle={bsStyle} disabled={isDisabled} {...rest}>
      {loading
        ? <Spinner spinColor={spinColor} spinAlignment={spinAlignment} />
        : icon
      }
      <div style={{ display: 'inline-block', padding: '0 4px' }}>
        {' '}
      </div>
      {children}
    </Button>
  );
}

SpinnerButton.propTypes = propTypes;
SpinnerButton.defaultProps = defaultProps;

export { SpinnerButton, Spinner };

export default SpinnerButton;
