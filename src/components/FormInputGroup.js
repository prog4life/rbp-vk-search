import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

const FormInputGroup = ({ id, label, help, ...props }) => {
  // const {
  //   id, label, type, placeholder, isDisabled, isRequired, value, onChange
  // } = props;

  return (
    <FormGroup controlId={id}>
      <ControlLabel>
        {label}
      </ControlLabel>
      <FormControl {...props} />
      {/* <FormControl
        disabled={isDisabled}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
        type={type}
        value={value}
      /> */}
      {/* {help && <HelpBlock>{help}</HelpBlock>} */}
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
};

FormInputGroup.propTypes = {
  id: PropTypes.string.isRequired,
  // isDisabled: PropTypes.bool,
  // isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  // help: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

FormInputGroup.defaultProps = {
  // isDisabled: false,
  // isRequired: false,
  placeholder: ''
};

export default FormInputGroup;

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
