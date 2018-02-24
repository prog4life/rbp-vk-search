import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

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
  onStopSearch: PropTypes.func.isRequired,
  search: PropTypes.shape({
    isActive: PropTypes.bool,
    total: PropTypes.number,
    processed: PropTypes.number,
    progress: PropTypes.number
  }).isRequired
};

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
      searchResultsLimit
    } = event.target.elements;

    // TODO: handle case with wrong wallOwnerId here or onChange with
    // request to API

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
  handleStopBtnClick(e) {
    e.preventDefault(); // TODO: to prevent submit, type="button" did not work
    const { onStopSearch } = this.props;
    // NOTE: probably this check and "search" destructuring are unnecessary
    // if (search.isActive) {
    onStopSearch();
    // }
  }
  render() {
    const {
      wallOwnerId,
      wallOwnerShortName,
      wallOwnerType,
      postAuthorId,
      searchResultsLimit
    } = this.state;
    // const { search } = this.props;

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
              {/* TODO: Create container for next 2 components ? */}
              {/* <SearchControlButtons
                isSearching={search.isActive}
                onStopClick={this.handleStopBtnClick}
              />
              {search.isActive &&
                <ProgressViewer
                  now={search.progress}
                  processedCount={search.processed}
                  total={search.total}
                />
              } */}
              <ControlsContainer
                itemsName="posts"
                onStopBtnClick={this.handleStopBtnClick}
              />
            </Col>
          </Row>
          {/* <Row>
            <Col md={6} lg={4} mdOffset={6} lgOffset={8}>
              <SearchControlButtons
                isSearching={search.isActive}
                onStopClick={this.handleStopBtnClick}
              />
            </Col>
          </Row> */}
        </form>
      </Grid>
    );
  }
}

SearchForm.propTypes = propTypes;

export default SearchForm;
