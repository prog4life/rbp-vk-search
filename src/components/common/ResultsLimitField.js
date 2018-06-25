import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from './FormInputGroup';

const ResultsLimitField = ({ input: { value, onChange }, isDisabled }) => (
  <FormInputGroup
    id="search-results-limit"
    name="resultsLimit"
    label="Max number of search results"
    onChange={onChange}
    placeholder="number of results"
    type="text"
    disabled={isDisabled}
    value={value}
  />
);

ResultsLimitField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default ResultsLimitField;
