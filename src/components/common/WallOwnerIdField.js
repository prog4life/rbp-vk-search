import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, isDisabled, validate) {
  if (isDisabled || !validate) {
    return undefined;
  }
  if (value.length < 1) {
    validate('wallOwnerId', 'error');
    return 'error';
  }
  return undefined;
}

const WallOwnerIdField = ({
  input: { value, onChange }, isDisabled, onIdTypeSwitch,
}) => (
  <FormInputGroup
    id="wall-owner-id"
    label="Wall owner id"
    validationState={null}
  >
    <InputGroup>
      <InputGroup.Addon>
        <input
          checked={!isDisabled}
          onChange={onIdTypeSwitch}
          type="radio"
          name="wallOwnerIdType"
          value="usualId"
        />
      </InputGroup.Addon>
      <FormControl
        name="wallOwnerId"
        onChange={onChange}
        placeholder="123456789"
        // required // TODO: this or short name must be entered, look below
        disabled={isDisabled}
        type="text"
        value={value}
      />
    </InputGroup>
  </FormInputGroup>
);

WallOwnerIdField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onIdTypeSwitch: PropTypes.func.isRequired,
};

// TODO: consider usage of usual FormGroup
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
