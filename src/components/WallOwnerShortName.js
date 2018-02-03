import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from 'components/FormInputGroup';

const WallOwnerShortName = ({ value, onChange }) => (
  <FormInputGroup
    id="wallOwnerShortName"
    label="Short name of wall owner (instead of id)"
    onChange={onChange}
    placeholder="wall owner textual id"
    // required // TODO: this or owner id name must be entered
    type="text"
    value={value}
  />
);

WallOwnerShortName.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default WallOwnerShortName;
