import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

// function FormFieldGroup({ id, label, help, ...props }) {
function FormFieldGroup(props) {
  const {id, label, help, type, placeholder, disabled, required, value,
    onChange} = props;

  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      {/* <FormControl {...props} /> */}
      <FormControl
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled || null}
        required={required || null} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );

  // return (
  //   <FormGroup controlId={id}>
  //     <Col md={4}>
  //       <ControlLabel>{label}</ControlLabel>
  //       <FormControl {...props} />
  //       {help && <HelpBlock>{help}</HelpBlock>}
  //     </Col>
  //   </FormGroup>
  // );

  // return (
  //   <FormGroup controlId={id}>
  //     <Col componentClass={ControlLabel} sm={1}>
  //       {label}
  //     </Col>
  //     <Col sm={5}>
  //       <FormControl {...props} />
  //     </Col>
  //     {help && <HelpBlock>{help}</HelpBlock>}
  //   </FormGroup>
  // );
}

export default FormFieldGroup;

FormFieldGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  help: PropTypes.any,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.boolean,
  required: PropTypes.boolean,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

// <FormGroup> will already serve as a grid row in a <Form horizontal>

// FormControl will get controlId from <FormGroup> if not explicitly specified

// <FormGroup controlId={id} validationState={this.getValidationState}>

// => one of 'success', 'warning', 'error' or null:
// getValidationState() {
//   const length = this.state.value.length;
//   if (length > 10) return 'success';
//   else if (length > 5) return 'warning';
//   else if (length > 0) return 'error';
// }
