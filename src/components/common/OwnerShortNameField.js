import React from 'react';
import PropTypes from 'prop-types';
import MaskedFormControl from 'react-bootstrap-maskedinput';
// TODO: test InputGroupAddon
import { FormControl, InputGroup } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, disabled, validate) {
  if (disabled || !validate) {
    return undefined;
  }
  if (value.length < 1 || value.length > 32) { // numbers, letters and _
    validate('wallOwnerShortName', 'error');
    return 'error';
  }
  return undefined;
}

const OwnerShortNameField = ({
  input: { value, onChange }, disabled, onIdTypeSwitch,
}) => (
  <FormInputGroup
    id="wall-owner-short-name"
    label="Short name of wall owner (instead of id)"
    validationState={null}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!disabled}
          onChange={onIdTypeSwitch}
          type="radio"
          name="wallOwnerIdType"
          value="shortName"
        />
      </InputGroup.Addon>
      <MaskedFormControl
        // componentClass={<MaskedInput />} // react-bootstrap prop
        disabled={disabled}
        mask={'w'.repeat(32)}
        formatCharacters={{
          w: {
            validate(char) { return /\w/.test(char); }, // \w === [A-Za-z0-9_]
            // transform(char) { return char.toUpperCase(); },
          },
        }}
        placeholderChar=" "
        name="wallOwnerShortName" // TODO: here or for radio input ?
        onChange={onChange}
        placeholder="short textual id of user or group"
        type="text"
        value={value}
      />
    </InputGroup>
  </FormInputGroup>
);

OwnerShortNameField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  onIdTypeSwitch: PropTypes.func.isRequired,
};

OwnerShortNameField.defaultProps = {
  isOwnerSpecified: true,
};

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

export default OwnerShortNameField;
