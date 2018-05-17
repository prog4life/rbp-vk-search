import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const WallOwnerTypeSelect = ({ input: { value, onChange }, disabled }) => (
  <FormGroup
    controlId="wall-owner-type"
    name="wallOwnerType"
  >
    <ControlLabel>
      {'Wall is owned by'}
    </ControlLabel>
    <FormControl
      componentClass="select"
      onChange={onChange}
      disabled={disabled}
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
};

export default WallOwnerTypeSelect;
