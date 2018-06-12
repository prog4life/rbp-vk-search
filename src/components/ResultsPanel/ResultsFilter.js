import React from 'react';
import { FormControl } from 'react-bootstrap';
// import FormInputGroup from 'components/common/FormInputGroup';

function ResultsFilter(props) {
  return (
    <div>
      {/* <span>
        {'Search in results: '}
      </span> */}
      <FormControl
        type="text"
        // value="Test filter text"
        placeholder="Write to search in results"
      />
      {/* <FormInputGroup
        id="search-in-results"
        // label="Search in results: "
      /> */}
    </div>
  );
}

export default ResultsFilter;
