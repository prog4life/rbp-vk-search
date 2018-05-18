import React from 'react';
import PropTypes from 'prop-types';
// to use with configured "babel-plugin-transform-imports"
import { reduxForm, Field } from 'redux-form';
import { Grid, Row, Col } from 'react-bootstrap';

import ControlsContainer from 'containers/ControlsContainer';
import PostAuthorIdField from './common/PostAuthorIdField';
import WallOwnerIdField from './common/WallOwnerIdField';
import OwnerShortNameField from './common/OwnerShortNameField';
import WallOwnerTypeSelect from './common/WallOwnerTypeSelect';
import SearchResultsLimitField from './common/SearchResultsLimitField';

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
};

class SearchForm extends React.Component { // TODO: use PureComponent ?
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);

    this.state = {
      isSubmitted: false,
      isShortNameUsed: false,
    };
    this.renderCount = 0;
  }
  componentWillReceiveProps(nextProps) {
    const { isSearchActive: currentIsActive } = this.props;
    const nextIsActive = nextProps.isSearchActive;

    // if search was stopped or finished validation should be disabled
    // and search start prevented
    if (currentIsActive !== nextIsActive && nextIsActive === false) {
      this.setState({
        isSubmitted: false,
      });
    }
  }
  componentDidUpdate() {
    const { isSubmitted, isShortNameUsed, ...rest } = this.state;
    const { onStartSearch } = this.props;

    console.log('cDU, render #', this.renderCount);

    // if (isSubmitted) {
    //   console.log('cDU CHECK PASSED, render #', this.renderCount);
    //   onStartSearch(rest);
    // }
  }
  handleSubmit(values) {
    // event.preventDefault();
    const { isSearchActive, onStartSearch } = this.props;

    if (isSearchActive) {
      return;
    }

    console.log('SUBMITTED values: ', values);
    // NOTE: will be executed once component is re-rendered
    // setState callbacks (second argument) now fire immediately after
    // componentDidMount / componentDidUpdate instead of after all components have rendered
    onStartSearch(values);
  }
  // TODO: looks like throttling is no more needed
  handleInputValueChange(event) {
    if (event.target.type === 'radio') {
      this.setState({
        isShortNameUsed: event.target.value === 'shortName',
      });
    }
  }
  render() {
    const { isSearchActive, handleSubmit } = this.props;
    const { isShortNameUsed } = this.state;

    this.renderCount = this.renderCount + 1;

    return (
      <Grid>
        <form
          className="search-form"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              {/* TODO: check id or shortname is used for validation by
                isDisabled prop */}
              <Field
                name="wallOwnerId"
                component={WallOwnerIdField}
                onIdTypeSwitch={this.handleInputValueChange}
                isDisabled={isSearchActive || isShortNameUsed}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerShortName"
                component={OwnerShortNameField}
                onIdTypeSwitch={this.handleInputValueChange}
                isDisabled={isSearchActive || !isShortNameUsed}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerType"
                component={WallOwnerTypeSelect}
                isDisabled={isSearchActive}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="postAuthorId"
                component={PostAuthorIdField}
                isDisabled={isSearchActive}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="searchResultsLimit"
                component={SearchResultsLimitField}
                isDisabled={isSearchActive}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4} >
              <ControlsContainer itemsName="posts" />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

SearchForm.propTypes = propTypes;

export default reduxForm({
  form: 'wall-posts',
  initialValues: {
    wallOwnerType: 'group',
  },
  // onSubmit: component.handleSubmit,
})(SearchForm);
