import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

const PostAuthorSexSelect = ({ input, isDisabled, onSearchTypeSwitch }) => {
  const { value, onChange } = input;

  return (
    <FormInputGroup
      id="post-author-sex"
      label="Post author sex"
    >
      <InputGroup>
        <InputGroup.Addon>
          <input
            checked={!isDisabled}
            onChange={onSearchTypeSwitch}
            type="radio"
            name="searchType"
            value="bySex"
          />
        </InputGroup.Addon>
        <FormControl
          // name="postAuthorSex"
          componentClass="select"
          disabled={isDisabled}
          onChange={onChange}
          value={value}
        >
          <option value="2">
            {'Man'}
          </option>
          <option value="1">
            {'Woman'}
          </option>
        </FormControl>
      </InputGroup>
    </FormInputGroup>
  );
};

PostAuthorSexSelect.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onSearchTypeSwitch: PropTypes.func.isRequired,
};

export default PostAuthorSexSelect;
