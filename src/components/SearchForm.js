import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form } from 'react-bootstrap';

import ControlsContainer from 'containers/ControlsContainer';
import PostAuthorId from './PostAuthorId';
import WallOwnerId from './WallOwnerId';
import WallOwnerShortName from './WallOwnerShortName';
import WallOwnerType from './WallOwnerType';
import SearchResultsLimit from './SearchResultsLimit';
// import SearchControlButtons from './SearchControlButtons';
// import ProgressViewer from './ProgressViewer';

const propTypes = {
  onStartSearch: PropTypes.func.isRequired,
  // search: PropTypes.shape({
  //   isActive: PropTypes.bool,
  // }).isRequired,
};

class SearchForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);

    this.state = {
      wallOwnerId: '',
      wallOwnerShortName: '',
      wallOwnerType: 'group',
      postAuthorId: '',
      searchResultsLimit: '',
    };
  }
  handleSubmit(event) {
    event.preventDefault();
    // const { search, onStartSearch } = this.props;
    const { onStartSearch } = this.props;

    // if (search.isActive) {
    //   return;
    // }

    const {
      wallOwnerId,
      wallOwnerShortName,
      wallOwnerType,
      postAuthorId,
      searchResultsLimit,
    // } = event.target.elements;
    } = this.state;

    // TODO: handle case with wrong wallOwnerId here or onChange with
    // request to API

    onStartSearch({
      wallOwnerId: wallOwnerId.value,
      wallOwnerShortName: wallOwnerShortName.value,
      wallOwnerType: wallOwnerType.value,
      postAuthorId: postAuthorId.value,
      searchResultsLimit: searchResultsLimit.value,
    });
  }
  // TODO: add debouncing
  // TODO: block fields when search is active
  handleInputValueChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }
  render() {
    const {
      wallOwnerId,
      wallOwnerShortName,
      wallOwnerType,
      postAuthorId,
      searchResultsLimit,
    } = this.state;

    return (
      <Grid>
        <Form className="search-form" onSubmit={this.handleSubmit}>
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
              <ControlsContainer itemsName="posts" />
            </Col>
          </Row>
          {/* <Row>
            <Col md={6} lg={4} mdOffset={6} lgOffset={8}>
              <ControlsContainer itemsName="posts" />
            </Col>
          </Row> */}
        </Form>
      </Grid>
    );
  }
}

SearchForm.propTypes = propTypes;

export default SearchForm;
