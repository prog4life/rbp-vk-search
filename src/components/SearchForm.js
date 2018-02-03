import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Row,
  Col
} from 'react-bootstrap';

import PostAuthorId from './PostAuthorId';
import WallOwnerId from './WallOwnerId';
import WallOwnerShortName from './WallOwnerShortName';
import WallOwnerType from './WallOwnerType';
import SearchResultsLimit from './SearchResultsLimit';
import SearchControlButtons from './SearchControlButtons';

class SearchForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.handleStopBtnClick = this.handleStopBtnClick.bind(this);

    this.state = {
      wallOwnerId: '',
      wallOwnerShortName: '',
      wallOwnerType: 'group',
      postAuthorId: '',
      searchResultsLimit: ''
    };
  }
  handleSubmit(event) {
    event.preventDefault();
    const { isSearching, onStartSearch } = this.props;

    if (isSearching) {
      return;
    }

    const {
      wallOwnerId,
      wallOwnerShortName,
      wallOwnerType,
      postAuthorId,
      searchResultsLimit
    } = event.target.elements;

    // TODO: rename "Domain" to "Screen Name" or "Short Name"

    onStartSearch({
      wallOwnerId: wallOwnerId.value,
      wallOwnerShortName: wallOwnerShortName.value,
      wallOwnerType: wallOwnerType.value,
      postAuthorId: postAuthorId.value,
      searchResultsLimit: searchResultsLimit.value
    });
  }
  handleInputValueChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleStopBtnClick() {
    const { isSearching, onStopSearch } = this.props;
    if (isSearching) {
      onStopSearch();
    }
  }
  render() {
    const {
      wallOwnerId,
      wallOwnerShortName,
      wallOwnerType,
      postAuthorId,
      searchResultsLimit
    } = this.state;
    const { isSearching } = this.props;

    return (
      <Grid>
        <form className="search-form" onSubmit={this.handleSubmit}>
          <Row>
            {/*  TODO: use names instead of id's */}
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <WallOwnerId
                onChange={this.handleInputValueChange}
                value={wallOwnerId}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <WallOwnerShortName
                onChange={this.handleInputValueChange}
                value={wallOwnerShortName}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <WallOwnerType
                onChange={this.handleInputValueChange}
                value={wallOwnerType}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <PostAuthorId
                onChange={this.handleInputValueChange}
                value={postAuthorId}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <SearchResultsLimit
                onChange={this.handleInputValueChange}
                value={searchResultsLimit}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4} >
              <SearchControlButtons
                isSearching={isSearching}
                onStopClick={this.handleStopBtnClick}
              />
            </Col>
          </Row>
          <Row>
            {/* <Col md={6} lg={4} mdOffset={6} lgOffset={8}>
              <SearchControlButtons
                isSearching={isSearching}
                onStopClick={this.handleStopBtnClick}
              />
            </Col> */}
          </Row>
        </form>
      </Grid>
    );
  }
}

SearchForm.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
  onStopSearch: PropTypes.func.isRequired
};

export default SearchForm;

