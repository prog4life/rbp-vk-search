import React from 'react';
import PropTypes from 'prop-types';
// to use with configured "babel-plugin-transform-imports"
import { reduxForm, Field } from 'redux-form';
import { Grid, Row, Col } from 'react-bootstrap';

import ControlsContainer from 'containers/ControlsContainer';
import PostAuthorIdField from 'components/common/PostAuthorIdField';
import WallOwnerIdField from 'components/common/WallOwnerIdField';
import OwnerCustomIdField from 'components/common/OwnerCustomIdField';
import WallOwnerTypeSelect from 'components/common/WallOwnerTypeSelect';
import PostAuthorSexSelect from 'components/common/PostAuthorSexSelect';
import SearchResultsLimitField from 'components/common/SearchResultsLimitField';

import './style.scss';

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

    // TODO: looks like throttling is no more needed

    console.log('SUBMITTED values: ', values);
    const {
      wallOwnerUsualId, wallOwnerCustomId, postAuthorId, postAuthorSex,
    } = values;
    // NOTE: will be executed once component is re-rendered
    // setState callbacks (second argument) now fire immediately after
    // componentDidMount / componentDidUpdate instead of after all components have rendered
    onStartSearch({
      ...values,
      wallOwnerUsualId: isCustomIdUsed ? null : Number(wallOwnerUsualId),
      wallOwnerCustomId: isCustomIdUsed ? wallOwnerCustomId : null,
      postAuthorId: searchType === 'byAuthorId' ? Number(postAuthorId) : null,
      postAuthorSex: searchType === 'byAuthorId' ? null : Number(postAuthorSex),
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

    return (
      <Grid>
        <form
          className="posts-search-form"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              {/* TODO: check id or shortname is used for validation by
                isDisabled prop */}
              <Field
                name="wallOwnerUsualId"
                component={WallOwnerIdField}
                onIdTypeSwitch={this.handleIdTypeSwitch}
                isDisabled={isSearchActive || isCustomIdUsed}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="wallOwnerCustomId"
                component={OwnerCustomIdField}
                onIdTypeSwitch={this.handleIdTypeSwitch}
                isDisabled={isSearchActive || !isCustomIdUsed}
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
                name="postAuthorSex"
                component={PostAuthorSexSelect}
                onSearchTypeSwitch={this.handleSearchTypeSwitch}
                isDisabled={isSearchActive || searchType !== 'bySex'}
              />
            </Col>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="searchResultsLimit"
                component={SearchResultsLimitField}
                isDisabled={isSearchActive}
              />
            </Col>
            {/* <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4} >
              <ControlsContainer itemsName="posts" />
            </Col> */}
          </Row>
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} >
              <ControlsContainer itemsName="posts" />
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
  },
  // onSubmit: component.handleSubmit,
})(PostsSearchForm);
