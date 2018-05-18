import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from './FormInputGroup';

const SearchResultsLimitField = ({ input: { value, onChange }, isDisabled }) => (
  <FormInputGroup
    id="search-results-limit"
    name="searchResultsLimit"
    label="Max number of search results"
    onChange={onChange}
    placeholder="number of results"
    type="text"
    disabled={isDisabled}
    value={value}
  />
);

SearchResultsLimitField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default SearchResultsLimitField;
