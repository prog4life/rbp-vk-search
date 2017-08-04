import React from 'react';
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

// function FormFieldGroup({ id, label, help, ...props }) {
function FormFieldGroup(props) {
  const { id, label, help, type, placeholder, disabled, required } = props;

  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      {/* <FormControl {...props} /> */}
      <FormControl
        type={type}
        // value={}
        placeholder={placeholder}
        // onChange={null}
        disabled={disabled || null}
        required={required || null} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );

  // return (
  //   <FormGroup controlId={id}>
  //     <Col md={4}>
  //       <ControlLabel>{label}</ControlLabel>
  //       {/* <FormControl {...props} /> */}
  //       <FormControl
  //         type={type}
  //         // value={}
  //         placeholder={placeholder}
  //         // onChange={null}
  //         disabled={disabled || null}
  //         required={required || null} />
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
  //       {/* <FormControl {...props} /> */}
  //       <FormControl
  //         type={type}
  //         // value={}
  //         placeholder={placeholder}
  //         // onChange={null}
  //         disabled={disabled || null}
  //         required={required || null} />
  //     </Col>
  //     {help && <HelpBlock>{help}</HelpBlock>}
  //   </FormGroup>
  // );
}

export default FormFieldGroup;

// <FormGroup> will already serve as a grid row in a horizontal form

// Uses controlId from <FormGroup> if not explicitly specified:
// <FormControl
//   type="text"
//   value={this.state.value}
//   placeholder="Enter text"
//   onChange={this.handleChange}
// />

// <FormGroup controlId={id} validationState={this.getValidationState}>

// => one of 'success', 'warning', 'error' or null:
// getValidationState() {
//   const length = this.state.value.length;
//   if (length > 10) return 'success';
//   else if (length > 5) return 'warning';
//   else if (length > 0) return 'error';
// }
