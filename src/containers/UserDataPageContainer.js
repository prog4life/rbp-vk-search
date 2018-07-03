import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Grid, Row, Col, Button } from 'react-bootstrap';

import * as actionCreators from 'actions';
import { getVisiblePosts } from 'selectors';

import FormInputGroup from 'components/common/FormInputGroup';

const UserIdField = ({ input: { value, onChange } }) => (
  <FormInputGroup
    id="user-id"
    label="User ID (numeric or custom)"
    name="userId"
    onChange={onChange}
    placeholder="id of user to search"
    // disabled={isDisabled}
    type="text"
    value={value}
  />
);

class UserDataPage extends React.Component {
  static propTypes = {
    handleSubmit: pt.func.isRequired,
  }
  handleSubmit = (values) => {
    const { fetchUserData, searchForLikesToPosts, dispatch } = this.props;

    console.log('USER DATA SUBMITTED values: ', values);

    // fetchUserData(values);
    dispatch((dispatch, getState) => {
      const posts = getVisiblePosts(getState());

      searchForLikesToPosts({
        posts, likerId: values.userId,
      });
    });
  }
  handleStopClick = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'SEARCH_BY_ITEMS_TERMINATE' });
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <Grid>
        <form
          className="user-data-form"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} sm={6} lg={4}>
              <Field
                name="userId"
                component={UserIdField}
              />
            </Col>
          </Row>
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} >
              <Button type="submit" bsStyle="info">
                {'Get User Data'}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xsOffset={1} smOffset={0} xs={10} >
              <Button type="button" onClick={this.handleStopClick}>
                {'Stop Search'}
              </Button>
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

const UserDataPageWrapped = reduxForm({
  form: 'user-data',
  // initialValues: {
  //   userId: '',
  // },
  // onSubmit: component.handleSubmit,
})(UserDataPage);

const { fetchUserData, searchForLikesToPosts } = actionCreators;

const propsToDispatch = { fetchUserData, searchForLikesToPosts };

// export default UserDataPageWrapped;
export default connect(null, propsToDispatch)(UserDataPageWrapped);
