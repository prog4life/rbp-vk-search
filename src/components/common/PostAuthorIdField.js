import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from './FormInputGroup';

function getValidationState(value, disabled, validate) {
  if (disabled || !validate) {
    return undefined;
  }
  if (value.length < 1) {
    validate('postAuthorId', 'error');
    return 'error';
  }
  return undefined;
}

const PostAuthorIdField = ({ input: { value, onChange }, disabled }) => (
  <FormInputGroup
    id="post-author-id"
    name="postAuthorId"
    label="ID of author of posts you want to find"
    onChange={onChange}
    placeholder="123456789"
    type="text"
    disabled={disabled}
    validationState={null}
    value={value}
  />
);

PostAuthorIdField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostAuthorIdField;
