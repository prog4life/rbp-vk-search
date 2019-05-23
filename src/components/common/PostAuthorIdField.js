import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(error, touched, disabled) {
  if (disabled) {
    return null;
  }
  return touched && error ? 'error' : null;
}

const PostAuthorIdField = ({ input, isDisabled, onSearchTypeSwitch, meta }) => {
  const { value, onChange } = input;
  const { error, touched } = meta;

  return (
    <FormInputGroup
      id="post-author-id"
      label="Post author id"
      validationState={getValidationState(error, touched, isDisabled)}
    >
      <InputGroup>
        <InputGroup.Addon>
          <input
            checked={!isDisabled}
            onChange={onSearchTypeSwitch}
            type="radio"
            name="searchType"
            value="byAuthorId"
          />
        </InputGroup.Addon>
        <FormControl
          // name="postAuthorId"
          placeholder="123456789"
          type="number"
          // this or post author gender must be entered
          required={isDisabled === false}
          disabled={isDisabled}
          onChange={onChange}
          value={value}
        />
      </InputGroup>
    </FormInputGroup>
  );
};

PostAuthorIdField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onSearchTypeSwitch: PropTypes.func.isRequired,
};

export default PostAuthorIdField;
