import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from 'components/FormInputGroup';

const SearchResultsLimitField = ({ value, onChange, disabled }) => (
  <FormInputGroup
    id="search-results-limit"
    name="searchResultsLimit"
    label="Max number of search results"
    onChange={onChange}
    placeholder="number of results"
    type="text"
    disabled={disabled}
    value={value}
  />
);

SearchResultsLimitField.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchResultsLimitField;
