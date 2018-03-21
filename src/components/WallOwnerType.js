import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const WallOwnerType = ({ value, onChange }) => (
  <FormGroup controlId="wallOwnerType">
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

WallOwnerType.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default WallOwnerType;
