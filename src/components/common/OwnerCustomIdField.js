import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, isDisabled, validate) {
  if (isDisabled || !validate) {
    return undefined;
  }
  if (value.length < 1 || value.length > 32) { // numbers, letters and _
    validate('wallOwnerCustomId', 'error');
    return 'error';
  }
  return undefined;
}

const OwnerCustomIdField = ({
  input: { value, onChange }, isDisabled, onIdTypeSwitch,
}) => (
  <FormInputGroup
    id="wall-owner-custom-id"
    label="Wall owner custom id"
    validationState={null}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!isDisabled}
          onChange={onIdTypeSwitch}
          type="radio"
          name="wallOwnerIdType"
          value="customId"
        />
      </InputGroup.Addon>
      <FormControl
        name="wallOwnerCustomId"
        onChange={onChange}
        placeholder="textual user id from url"
        disabled={isDisabled}
        type="text"
        value={value}
      />
    </InputGroup>
  </FormInputGroup>
);

OwnerCustomIdField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onIdTypeSwitch: PropTypes.func.isRequired,
};

export default OwnerCustomIdField;
