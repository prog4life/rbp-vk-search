import React from 'react';
import { FormControl } from 'react-bootstrap';
// import FormInputGroup from 'components/common/FormInputGroup';

function SearchInResultsFilter(props) {
  const { order, changePostsOrder } = props;

  const onChangeOrder = (event) => {
    console.log('order value ', event.target.value);

    changePostsOrder(event.target.value);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* <span>
        {'Search in results: '}
      </span> */}
      <FormControl
        type="text"
        // value="Test filter text"
        placeholder="Write to search in results"
        style={{ flex: '0 1 50%' }}
      />
      <FormControl
        componentClass="select"
        onChange={onChangeOrder}
        value={order}
        style={{ flex: '0 1 14rem' }}
      >
        <option value="descend">
          {'Recent First'}
        </option>
        <option value="ascend">
          {'Oldest First'}
        </option>
      </FormControl>
      {/* <FormInputGroup
        id="search-in-results"
        // label="Search in results: "
      /> */}
    </div>
  );
}

export default SearchInResultsFilter;
