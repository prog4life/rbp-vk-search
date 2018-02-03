import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from 'components/FormInputGroup';

const WallOwnerId = ({ value, onChange }) => (
  <FormInputGroup
    id="wallOwnerId"
    label="Wall owner id"
    onChange={onChange}
    placeholder="id of user or group"
    // required // TODO: this or short name must be entered, look below
    type="text"
    value={value}
  />
);

WallOwnerId.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default WallOwnerId;


// One of solution to switch between entering of usual id or short textual id

// <FormGroup>
//   <InputGroup>
//     <InputGroup.Addon>
//       <input type="checkbox" aria-label="..." />
//     </InputGroup.Addon>
//     <FormControl type="text" />
//   </InputGroup>
// </FormGroup>

