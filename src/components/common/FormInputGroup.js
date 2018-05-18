import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

const FormInputGroup = ({
  id, label, help, validationState, children, ...restProps
}) => (
  <FormGroup
    controlId={id}
    validationState={validationState}
  >
    <ControlLabel>
      {label}
    </ControlLabel>
    {children || <FormControl {...restProps} />}
    {help &&
      <HelpBlock>
        {help}
      </HelpBlock>
    }
  </FormGroup>
);

FormInputGroup.propTypes = {
  children: PropTypes.node,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  // isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

FormInputGroup.defaultProps = {
  children: null,
  help: null,
  // isRequired: false,
  validationState: null,
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

// return (
//   <FormGroup controlId={id}>
//     <Col md={4}>
//       <ControlLabel>{label}</ControlLabel>
//       <FormControl {...restProps} />
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
//       <FormControl {...restProps} />
//     </Col>
//     {help && <HelpBlock>{help}</HelpBlock>}
//   </FormGroup>
// );
