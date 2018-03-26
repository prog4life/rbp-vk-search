import React from 'react';
import PropTypes from 'prop-types';
import MaskedFormControl from 'react-bootstrap-maskedinput';
// TODO: test InputGroupAddon
import { FormControl, InputGroup } from 'react-bootstrap';
import FormInputGroup from 'components/FormInputGroup';

function getValidationState(value, disabled, fail) {
  if (disabled || !fail) {
    return undefined;
  }
  if (value.length < 1) {
    fail();
    return 'error';
  }
  return undefined;
}

const WallOwnerIdField = ({ value, onChange, disabled, fail }) => (
  <FormInputGroup
    id="wall-owner-id"
    label="Wall owner id"
    // required // TODO: this or short name must be entered, look below
    validationState={getValidationState(value, disabled, fail)}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!disabled}
          onChange={onChange}
          type="radio"
          name="wallOwnerIdType"
          value="usualId"
        />
      </InputGroup.Addon>
      <MaskedFormControl
        // fefefokokokokokkkokokokokokokfeo - 32 chars in screen name
        disabled={disabled}
        mask="1111111111"
        placeholderChar=" "
        name="wallOwnerId" // TODO: here or for radio input ?
        onChange={onChange}
        placeholder="id of user or group without 'id' part"
        type="text"
        value={value}
      />
    </InputGroup>
  </FormInputGroup>
);

// const prevContents = (
//   <FormInputGroup
//     id="wall-owner-id"
//     name="wallOwnerId"
//     label="Wall owner id"
//     onChange={onChange}
//     placeholder="id of user or group"
//     // required // TODO: this or short name must be entered, look below
//     type="text"
//     validationState={getValidationState(isOwnerSpecified)}
//     value={value}
//   />
// );

// const alt = (
//   <FormGroup
//     controlId="wall-owner-id"
//     validationState={getValidationState(isOwnerSpecified)}
//   >
//     <ControlLabel>
//       {'Wall owner id'}
//     </ControlLabel>
//     <InputGroup>
//       <InputGroup.Addon>
//         <input type="radio" name="wallOwner" />
//       </InputGroup.Addon>
//       <FormControl
//         onChange={onChange}
//         placeholder="id of user or group"
//         type="text"
//         value={value}
//       />
//     </InputGroup>
//     {/* {help && <HelpBlock>{help}</HelpBlock>} */}
//   </FormGroup>
// );

WallOwnerIdField.propTypes = {
  isOwnerSpecified: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

WallOwnerIdField.defaultProps = {
  isOwnerSpecified: true,
};

export default WallOwnerIdField;

// One of solution to switch between entering of usual id or short textual id

// <FormGroup>
//   <InputGroup>
//     <InputGroup.Addon>
//       <input type="checkbox" aria-label="..." />
//     </InputGroup.Addon>
//     <FormControl type="text" />
//   </InputGroup>
// </FormGroup>
