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
      // validation: {},
      // wallOwnerId: '',
      // wallOwnerShortName: '',
      // wallOwnerType: 'group',
      // postAuthorId: '',
      // searchResultsLimit: '',
    };
    this.validation = {};
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

    console.log('cDU BEFORE CHECK, render #', this.renderCount);

    if (isSubmitted && this.checkValidation(this.validation)) {
      console.log('cDU CHECK PASSED, render #', this.renderCount);
      onStartSearch(rest);
    }
  }
  setValidation = (name, result) => {
    //   this.isFormValid = false;
    this.validation[name] = result;
    console.log(`VALIDATION for "${name}" was set as "${result}", render #${this.renderCount}`);
    // this.setState(prevState => ({
    //   validation: { ...prevState.validation, [name]: result },
    // }));
  }
  resetValidation() {
    this.validation = {
      wallOwnerId: 'success',
      wallOwnerShortName: 'success',
      postAuthorId: 'success',
    };
  }
  checkValidation = (validation) => {
    const fields = Object.keys(validation);

    return fields.length === 3 && fields.every(field => (
      validation[field] && validation[field] !== 'error'
    ));
  }
  handleSubmit(values) {
    // event.preventDefault();
    const { isSearchActive, onStartSearch } = this.props;

    if (isSearchActive) {
      return;
    }

    console.log('SUBMITTED: ', values);
    // NOTE: will be executed once component is re-rendered
    // setState callbacks (second argument) now fire immediately after
    // componentDidMount / componentDidUpdate instead of after all components have rendered
  }
  // TODO: add throttling
  handleInputValueChange(event) {
    if (event.target.type === 'radio') {
      this.setState({
        isShortNameUsed: event.target.value === 'shortName',
      });
      // return;
    }
    // this.setState({
    //   [event.target.name]: event.target.value.trim(),
    // });
  }
  render() {
    const { isSearchActive, handleSubmit } = this.props;
    const { isShortNameUsed } = this.state;

    this.renderCount = this.renderCount + 1;

    return (
      <Grid>
        <form className="search-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              {/* TODO: isRequired={!isShortNameUsed} */}
              <Field
                name="wallOwnerId"
                component={WallOwnerIdField}
                onIdTypeSwitch={this.handleInputValueChange}
                disabled={isSearchActive || isShortNameUsed}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerShortName"
                component={OwnerShortNameField}
                onIdTypeSwitch={this.handleInputValueChange}
                disabled={isSearchActive || !isShortNameUsed}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerType"
                component={WallOwnerTypeSelect}
                disabled={isSearchActive}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="postAuthorId"
                component={PostAuthorIdField}
                disabled={isSearchActive}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="searchResultsLimit"
                component={SearchResultsLimitField}
                disabled={isSearchActive}
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
  // onSubmit: SearchForm.handleSubmit,
})(SearchForm);
