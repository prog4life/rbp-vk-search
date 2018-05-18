import React from 'react';
import PropTypes from 'prop-types';
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

const PostAuthorIdField = ({ input: { value, onChange }, isDisabled }) => (
  <FormInputGroup
    id="post-author-id"
    name="postAuthorId"
    label="Post author id"
    onChange={onChange}
    placeholder="123456789"
    type="text"
    disabled={isDisabled}
    validationState={null}
    value={value}
  />
);

PostAuthorIdField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default PostAuthorIdField;
