import React from 'react';
import pT from 'prop-types';
import throttle from 'lodash-es/throttle';
import { FormControl } from 'react-bootstrap';

import './style.scss';

class SearchResultsFilter extends React.Component {
  state = {
    filterText: '',
  }
  setFilterTextThrottled = throttle(
    this.props.setPostsFilterText, // eslint-disable-line react/destructuring-assignment
    1000,
    { leading: true, trailing: true },
  )
  handleFilterTextChange = (event) => {
    const inputValue = event.target.value;

    this.setFilterTextThrottled(inputValue);
    this.setState({
      filterText: inputValue,
    });
  }
  handleOrderChange = (event) => {
    const { setPostsSortOrder } = this.props;

    setPostsSortOrder(event.target.value);
  }
  render() {
    const { sortOrder } = this.props;
    const { filterText } = this.state;

    return (
      <div className="search-results-filter">
        <FormControl
          className="search-results-filter__text-input"
          type="text"
          placeholder="Write to search in results"
          onChange={this.handleFilterTextChange}
          value={filterText}
        />
        <FormControl
          className="search-results-filter__sort-order"
          componentClass="select"
          onChange={this.handleOrderChange}
          value={sortOrder}
        >
          <option value="descend">
            {'Recent First'}
          </option>
          <option value="ascend">
            {'Oldest First'}
          </option>
        </FormControl>
      </div>
    );
  }
}

SearchResultsFilter.propTypes = {
  setPostsFilterText: pT.func.isRequired,
  setPostsSortOrder: pT.func.isRequired,
  sortOrder: pT.string.isRequired,
};

export default SearchResultsFilter;
