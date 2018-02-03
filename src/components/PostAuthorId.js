import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from 'components/FormInputGroup';

const PostAuthorId = ({ value, onChange }) => (
  <FormInputGroup
    id="postAuthorId"
    label="ID of author of posts, that need to search"
    onChange={onChange}
    placeholder="id of post author"
    required
    type="text"
    value={value}
  />
);

PostAuthorId.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default PostAuthorId;
