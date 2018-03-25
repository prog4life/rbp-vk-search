import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

import ControlsContainer from 'containers/ControlsContainer';
import PostAuthorIdField from './PostAuthorIdField';
import WallOwnerIdField from './WallOwnerIdField';
import OwnerShortNameField from './OwnerShortNameField';
import WallOwnerTypeSelect from './WallOwnerTypeSelect';
import SearchResultsLimitField from './SearchResultsLimitField';
// import SearchControlButtons from './SearchControlButtons';
// import ProgressViewer from './ProgressViewer';

const propTypes = {
  onStartSearch: PropTypes.func.isRequired,
  // search: PropTypes.shape({
  //   isActive: PropTypes.bool,
  // }).isRequired,
};

class SearchForm extends React.Component { // TODO: use PureComponent ?
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);

    this.state = {
      shouldValidate: false,
      isShortNameChecked: false,
      // isValidationOk: undefined,
      wallOwnerId: '',
      wallOwnerShortName: '',
      wallOwnerType: 'group',
      postAuthorId: '',
      searchResultsLimit: '',
    };
  }
  validate = (isValid) => {
    if (!isValid) {
      this.setState({ isValidationOk: false });
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    // const { search, onStartSearch } = this.props;
    const { onStartSearch } = this.props;
    // const { wallOwnerId, wallOwnerShortName } = this.state;

    // if (search.isActive) {
    //   return;
    // }

    this.setState({
      shouldValidate: true,
    });

    if (this.state.isValidationOk) {}

    // const {
    //   wallOwnerId,
    //   wallOwnerShortName,
    //   wallOwnerType,
    //   postAuthorId,
    //   searchResultsLimit,
    // } = event.target.elements;
    // } = this.state;

    // TODO: handle case with wrong wallOwnerId here or onChange with
    // request to API

    // onStartSearch({
    //   wallOwnerId: wallOwnerId.value,
    //   wallOwnerShortName: wallOwnerShortName.value,
    //   wallOwnerType: wallOwnerType.value,
    //   postAuthorId: postAuthorId.value,
    //   searchResultsLimit: searchResultsLimit.value,
    // });
    onStartSearch(this.state);
  }
  // TODO: add debouncing
  // TODO: block fields when search is active
  handleInputValueChange(event) {
    if (event.target.type === 'radio') {
      this.setState({
        isShortNameChecked: event.target.value === 'shortName',
      });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value.trim(),
    });
  }
  render() {
    const {
      shouldValidate,
      isShortNameChecked,
      wallOwnerId,
      wallOwnerShortName,
      // wallOwner,
      wallOwnerType,
      postAuthorId,
      searchResultsLimit,
    } = this.state;

    return (
      <Grid>
        <form className="search-form" onSubmit={this.handleSubmit}>
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <WallOwnerIdField
                disabled={isShortNameChecked}
                // isOwnerSpecified={isOwnerSpecified}
                onChange={this.handleInputValueChange}
                shouldValidate={shouldValidate}
                value={wallOwnerId}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <OwnerShortNameField
                disabled={!isShortNameChecked}
                // isOwnerSpecified={isOwnerSpecified}
                onChange={this.handleInputValueChange}
                shouldValidate={shouldValidate}
                value={wallOwnerShortName}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <WallOwnerTypeSelect
                onChange={this.handleInputValueChange}
                value={wallOwnerType}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <PostAuthorIdField
                // disabled={isSearchActive}
                onChange={this.handleInputValueChange}
                shouldValidate={shouldValidate}
                value={postAuthorId}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <SearchResultsLimitField
                onChange={this.handleInputValueChange}
                shouldValidate={shouldValidate}
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
        </form>
      </Grid>
    );
  }
}

SearchForm.propTypes = propTypes;

export default SearchForm;
