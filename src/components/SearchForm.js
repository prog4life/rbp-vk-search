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
  isSearchActive: PropTypes.bool.isRequired,
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
      wallOwnerId: '',
      wallOwnerShortName: '',
      wallOwnerType: 'group',
      postAuthorId: '',
      searchResultsLimit: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    const { isSearchActive: currentIsActive } = this.props;
    const nextIsActive = nextProps.isSearchActive;

    if (currentIsActive !== nextIsActive && nextIsActive === false) {
      this.setState({
        shouldValidate: false,
      });
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  // }
  failValidation = () => {
    this.isFormValid = false;
  }
  handleSubmit(event) {
    event.preventDefault();
    const { isSearchActive, onStartSearch } = this.props;
    // const { wallOwnerId, wallOwnerShortName } = this.state;

    if (isSearchActive) {
      return;
    }

    this.isFormValid = true;
    // this.notValidFields = [];

    this.setState({
      shouldValidate: true,
    }, () => {
      // NOTE: will be executed once component is re-rendered
      // if (this.notValidFields && !this.notValidFields.length) {
      if (this.isFormValid) {
        onStartSearch(this.state);
      }
    });

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
    // onStartSearch(this.state);
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
    const { isSearchActive } = this.props;
    const {
      shouldValidate,
      isShortNameChecked,
      wallOwnerId,
      wallOwnerShortName,
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
                disabled={isSearchActive || isShortNameChecked}
                onChange={this.handleInputValueChange}
                fail={shouldValidate && this.failValidation}
                value={wallOwnerId}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <OwnerShortNameField
                disabled={isSearchActive || !isShortNameChecked}
                onChange={this.handleInputValueChange}
                fail={shouldValidate && this.failValidation}
                value={wallOwnerShortName}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <WallOwnerTypeSelect
                disabled={isSearchActive}
                onChange={this.handleInputValueChange}
                value={wallOwnerType}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <PostAuthorIdField
                disabled={isSearchActive}
                onChange={this.handleInputValueChange}
                fail={shouldValidate && this.failValidation}
                value={postAuthorId}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <SearchResultsLimitField
                disabled={isSearchActive}
                onChange={this.handleInputValueChange}
                fail={shouldValidate && this.failValidation}
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
