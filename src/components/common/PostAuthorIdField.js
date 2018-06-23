import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, isDisabled, validate) {
  if (isDisabled || !validate) {
    return undefined;
  }
  if (value.length < 1) {
    validate('postAuthorId', 'error');
    return 'error';
  }
  return undefined;
}

const PostAuthorIdField = ({ input, isDisabled, onSearchTypeSwitch }) => {
  const { value, onChange } = input;

  return (
    <FormInputGroup
      id="post-author-id"
      label="Post author id"
      validationState={null}
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
          type="text"
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
