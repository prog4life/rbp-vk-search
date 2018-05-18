import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, isDisabled, validate) {
  if (isDisabled || !validate) {
    return undefined;
  }
  if (value.length < 1 || value.length > 32) { // numbers, letters and _
    validate('wallOwnerShortName', 'error');
    return 'error';
  }
  return undefined;
}

const OwnerShortNameField = ({
  input: { value, onChange }, isDisabled, onIdTypeSwitch,
}) => (
  <FormInputGroup
    id="wall-owner-short-name"
    label="Short name of wall owner"
    validationState={null}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!isDisabled}
          onChange={onIdTypeSwitch}
          type="radio"
          name="wallOwnerIdType"
          value="shortName"
        />
      </InputGroup.Addon>
      <FormControl
        name="wallOwnerShortName"
        onChange={onChange}
        placeholder="short textual id (instead of numeric id)"
        disabled={isDisabled}
        type="text"
        value={value}
      />
    </InputGroup>
  </FormInputGroup>
);

OwnerShortNameField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onIdTypeSwitch: PropTypes.func.isRequired,
};

export default OwnerShortNameField;
