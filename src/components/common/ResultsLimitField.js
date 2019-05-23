import React from 'react';
import PropTypes from 'prop-types';
import FormInputGroup from './FormInputGroup';

const ResultsLimitField = ({ input, isDisabled, meta }) => {
  const { value, onChange } = input;
  const { error, touched } = meta;

  return (
    <FormInputGroup
      id="search-results-limit"
      name="resultsLimit"
      label="Max number of search results"
      onChange={onChange}
      placeholder="number of results"
      type="number"
      disabled={isDisabled}
      value={value}
      validationState={touched && error ? 'error' : null}
    />
  );
};

ResultsLimitField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default ResultsLimitField;
