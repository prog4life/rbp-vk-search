import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from 'components/FormInputGroup';

function getValidationState(value, disabled, fail) {
  if (disabled || !fail) {
    return undefined;
  }
  if (value.length < 1) {
    fail();
    return 'error';
  }
  return undefined;
}

const PostAuthorIdField = ({ value, onChange, disabled, fail }) => (
  <FormInputGroup
    id="post-author-id"
    name="postAuthorId"
    label="ID of author of posts you want to find"
    onChange={onChange}
    placeholder="id of post author"
    type="text"
    validationState={getValidationState(value, disabled, fail)}
    value={value}
  />
);

PostAuthorIdField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default PostAuthorIdField;
