import React from 'react';
import PropTypes from 'prop-types';
// TODO: test InputGroupAddon
import { InputGroup } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, disabled, validate) {
  if (disabled || !validate) {
    return undefined;
  }
  if (value.length < 1) {
    validate('wallOwnerId', 'error');
    return 'error';
  }
  return undefined;
}

const WallOwnerIdField = ({
  input: { value, onChange }, disabled, isRequired, onIdTypeSwitch
}) => (
  <FormInputGroup
    id="wall-owner-id"
    name="wallOwnerId"
    label="Wall owner id"
    onChange={onChange}
    placeholder="123456789"
    // required // TODO: this or short name must be entered, look below
    type="text"
    validationState={null}
    value={value}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!disabled}
          onChange={onIdTypeSwitch}
          type="radio"
          name="wallOwnerIdType"
          value="usualId"
        />
      </InputGroup.Addon>
    </InputGroup>
  </FormInputGroup>
);

WallOwnerIdField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  onIdTypeSwitch: PropTypes.func.isRequired,
};

WallOwnerIdField.defaultProps = {
  isOwnerSpecified: true,
};

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
