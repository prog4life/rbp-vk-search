import React from 'react';
import PropTypes from 'prop-types';
// to use with configured "babel-plugin-transform-imports"
import { reduxForm, Field } from 'redux-form';
import { Grid, Row, Col } from 'react-bootstrap';

import SearchControlsContainer from 'containers/SearchControlsContainer';
import PostAuthorIdField from 'components/common/PostAuthorIdField';
import WallOwnerIdField from 'components/common/WallOwnerIdField';
import OwnerCustomIdField from 'components/common/OwnerCustomIdField';
import WallOwnerTypeSelect from 'components/common/WallOwnerTypeSelect';
import PostAuthorGenderSelect from 'components/common/PostAuthorGenderSelect';
import ResultsLimitField from 'components/common/ResultsLimitField';

import './style.scss';

const required = value => (value ? undefined : 'Required');

const isPositiveInt = (value) => {
  const num = Number(value);
  return !value || (Number.isInteger(num) && num > 0)
    ? undefined
    : 'Must be a positive integer';
};

const isCorrectId = (value) => {
  const hasIdPrefix = value.slice(0, 2) === 'id';
  return hasIdPrefix && isPositiveInt(value.slice(2)) === undefined
    ? undefined
    : 'Must be "id" word with numbers right after it';
};

const maxLength = max => value => (
  value && value.length > max
    ? `Must be ${max} characters or less`
    : undefined
);

const maxLength18 = maxLength(18);

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSearchActive: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
};

class PostsSearchForm extends React.Component { // TODO: use PureComponent ?
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIdTypeSwitch = this.handleIdTypeSwitch.bind(this);
    this.handleSearchTypeSwitch = this.handleSearchTypeSwitch.bind(this);

    this.state = {
      isSubmitted: false,
      isCustomIdUsed: false,
      searchType: 'byAuthorId',
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
    const { isSubmitted, isCustomIdUsed, ...rest } = this.state;
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
    const { isCustomIdUsed, searchType } = this.state;

    if (isSearchActive) {
      return;
    }

    // TODO: validate that either wallOwnerUsualId or wallOwnerCustomId is
    // entered, same for postAuthorId and postAuthorGender

    // TODO: looks like throttling is no more needed

    console.log('SUBMITTED values: ', values);
    const {
      wallOwnerUsualId, wallOwnerCustomId, postAuthorId, postAuthorGender,
    } = values;
    // NOTE: will be executed once component is re-rendered
    // setState callbacks (second argument) now fire immediately after
    // componentDidMount / componentDidUpdate instead of after all components have rendered
    onStartSearch({
      ...values,
      wallOwnerUsualId: isCustomIdUsed ? null : Number(wallOwnerUsualId),
      wallOwnerCustomId: isCustomIdUsed ? wallOwnerCustomId : null,
      postAuthorId: searchType === 'byAuthorId' ? Number(postAuthorId) : null,
      postAuthorGender: searchType === 'byAuthorId' ? null : Number(postAuthorGender),
      resultsLimit: Number(values.resultsLimit) || null,
    });
  }

  handleIdTypeSwitch(event) {
    const { target } = event;

    if (target.type === 'radio' && target.name === 'wallOwnerIdType') {
      this.setState({
        isCustomIdUsed: target.value === 'customId',
      });
    }
  }

  handleSearchTypeSwitch(event) {
    if (event.target.type === 'radio' && event.target.name === 'searchType') {
      this.setState({
        searchType: event.target.value,
      });
    }
  }

  render() {
    const { isSearchActive, handleSubmit } = this.props;
    const { isCustomIdUsed, searchType } = this.state;

    this.renderCount = this.renderCount + 1;

    // TODO: extract IdField component for WallOwnerIdField and OwnerCustomIdField

    return (
      <Grid>
        <form
          className="posts-search-form"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerUsualId"
                component={WallOwnerIdField}
                onIdTypeSwitch={this.handleIdTypeSwitch}
                isDisabled={isSearchActive || isCustomIdUsed}
                validate={[required, isPositiveInt, maxLength18]}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerCustomId"
                component={OwnerCustomIdField}
                onIdTypeSwitch={this.handleIdTypeSwitch}
                isDisabled={isSearchActive || !isCustomIdUsed}
                validate={[required, isPositiveInt, maxLength18]}
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
                onSearchTypeSwitch={this.handleSearchTypeSwitch}
                isDisabled={isSearchActive || searchType !== 'byAuthorId'}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="postAuthorGender"
                component={PostAuthorGenderSelect}
                onSearchTypeSwitch={this.handleSearchTypeSwitch}
                isDisabled={isSearchActive || searchType !== 'byGender'}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="resultsLimit"
                component={ResultsLimitField}
                validate={[isPositiveInt]}
                isDisabled={isSearchActive}
              />
            </Col>
          </Row>
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={12}>
              <SearchControlsContainer itemsName="posts" />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

PostsSearchForm.propTypes = propTypes;

export default reduxForm({
  form: 'wall-posts',
  initialValues: {
    wallOwnerType: 'group',
    postAuthorGender: '1',
  },
  // onSubmit: component.handleSubmit,
})(PostsSearchForm);
