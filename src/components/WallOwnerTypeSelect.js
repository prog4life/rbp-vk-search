import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const WallOwnerTypeSelect = ({ value, onChange }) => (
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
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default WallOwnerTypeSelect;
