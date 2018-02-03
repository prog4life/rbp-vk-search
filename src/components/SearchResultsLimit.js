import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from 'components/FormInputGroup';

const SearchResultsLimit = ({ value, onChange }) => (
  <FormInputGroup
    id="searchResultsLimit"
    label="Max number of search results"
    onChange={onChange}
    placeholder="number of results"
    type="text"
    value={value}
  />
);

SearchResultsLimit.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default SearchResultsLimit;
