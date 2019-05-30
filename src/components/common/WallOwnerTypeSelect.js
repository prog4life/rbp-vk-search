import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const WallOwnerTypeSelect = ({ input: { value, onChange }, isDisabled }) => (
  <FormGroup controlId="wall-owner-type">
    <ControlLabel>
      {'Wall is owned by'}
    </ControlLabel>
    <FormControl
      name="wallOwnerType"
      componentClass="select"
      onChange={onChange}
      disabled={isDisabled}
      value={value}
    >
      <option value="user">
        {'User'}
      </option>
      <option value="group">
        {'Community / Group'}
      </option>
    </FormControl>
  </FormGroup>
);

WallOwnerTypeSelect.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default WallOwnerTypeSelect;
