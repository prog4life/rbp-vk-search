import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, FormControl } from 'react-bootstrap';
import FormInputGroup from './FormInputGroup';

const PostAuthorGenderSelect = ({ input, isDisabled, onSearchTypeSwitch }) => {
  const { value, onChange } = input;

  return (
    <FormInputGroup
      id="post-author-gender"
      label="Post author gender"
    >
      <InputGroup>
        <InputGroup.Addon>
          <input
            checked={!isDisabled}
            onChange={onSearchTypeSwitch}
            type="radio"
            name="searchType"
            value="byGender"
          />
        </InputGroup.Addon>
        <FormControl
          // name="postAuthorGender"
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

PostAuthorGenderSelect.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onSearchTypeSwitch: PropTypes.func.isRequired,
};

export default PostAuthorGenderSelect;
