import React from 'react';
import PropTypes from 'prop-types';
// TODO: test InputGroupAddon
import { FormControl, InputGroup } from 'react-bootstrap';
import FormInputGroup from 'components/FormInputGroup';

function getValidationState(value, disabled, shouldValidate) {
  if (disabled || !shouldValidate) {
    return undefined;
  }
  if (value.trim().length < 1) {
    return 'error';
  }
  return undefined;
}

const OwnerShortNameField = ({ value, onChange, disabled, shouldValidate }) => (
  <FormInputGroup
    id="wall-owner-short-name"
    label="Short name of wall owner (instead of id)"
    validationState={getValidationState(value, disabled, shouldValidate)}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!disabled}
          onChange={onChange}
          type="radio"
          name="wallOwnerIdType"
          value="shortName"
        />
      </InputGroup.Addon>
      <FormControl
        disabled={disabled}
        name="wallOwnerShortName" // TODO: here or for radio input ?
        onChange={onChange}
        placeholder="short textual id of user or group"
        type="text"
        value={value}
      />
    </InputGroup>
  </FormInputGroup>
);

// const prev = (
//   <FormInputGroup
//     id="wall-owner-short-name"
//     name="wallOwnerShortName"
//     label="Short name of wall owner (instead of id)"
//     onChange={onChange}
//     placeholder="wall owner textual id"
//     type="text"
//     validationState={getValidationState(isOwnerSpecified)}
//     value={value}
//   />
// );

OwnerShortNameField.propTypes = {
  isOwnerSpecified: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

OwnerShortNameField.defaultProps = {
  isOwnerSpecified: true,
};


export default OwnerShortNameField;
