import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonToolbar, Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import FormFieldGroup from './FormFieldGroup';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);

    this.state = {
      wallOwnerId: '',
      wallOwnerDomain: '',
      wallOwnerType: 'group',
      searchQuery: '',
      authorId: '',
      postsAmount: ''
    };
  }
  handleSubmit(event) {
    event.preventDefault();

    if (this.props.isSearching) {
      this.props.onStopSearch();
      return;
    }

    const {
      wallOwnerId,
      wallOwnerDomain,
      wallOwnerType,
      searchQuery,
      authorId,
      postsAmount
    } = event.target.elements;

    this.props.onStartSearch({
      wallOwnerId: wallOwnerId.value,
      wallOwnerDomain: wallOwnerDomain.value,
      wallOwnerType: wallOwnerType.value,
      searchQuery: searchQuery.value,
      authorId: authorId.value,
      postsAmount: postsAmount.value
    });
  }
  handleTextInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    }, () => console.info('New searchform state: ', this.state));
  }
  render() {
    const {
      wallOwnerId,
      wallOwnerDomain,
      wallOwnerType,
      searchQuery,
      authorId,
      postsAmount
    } = this.state;
    const { isSearching } = this.props;

    const searchBtnTxt = isSearching ? 'Searching...' : 'Start Search';
    const stopBtnTxt = 'Stop Search';
    const stopBtn = (
      <Button type="submit">
        {stopBtnTxt}
      </Button>
    );

    return (
      <Grid>
        <form onSubmit={this.handleSubmit}>
          <Row>
            {/*  TODO: use names instead of id's */}
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                id="wallOwnerId"
                label="Wall owner id (user or group)"
                onChange={this.handleTextInputChange}
                placeholder="wall owner id"
                type="text"
                value={wallOwnerId}
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                id="wallOwnerDomain"
                label="Short name of wall owner (instead of id)"
                onChange={this.handleTextInputChange}
                placeholder="wall owner textual id"
                type="text"
                value={wallOwnerDomain}
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormGroup controlId="wallOwnerType">
                <ControlLabel>
                  {'Wall is owned by'}
                </ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={this.handleTextInputChange}
                  value={wallOwnerType}
                >
                  <option value="user">
                    {'User'}
                  </option>
                  <option value="group">
                    {'Community / Group'}
                  </option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                disabled
                id="searchQuery"
                label="Text to search in post (optional, disabled)"
                onChange={this.handleTextInputChange}
                placeholder="text to search"
                type="text"
                value={searchQuery}
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                id="authorId"
                label="Post author id, which posts to search (required)"
                onChange={this.handleTextInputChange}
                placeholder="post author id"
                required
                type="text"
                value={authorId}
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                id="postsAmount"
                label="Amount of search results to show"
                onChange={this.handleTextInputChange}
                placeholder="number of results"
                type="text"
                value={postsAmount}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} lg={4} mdOffset={6} lgOffset={8}>
              <ButtonToolbar>
                <Button
                  bsStyle="info"
                  disabled={isSearching}
                  type="submit"
                >
                  {searchBtnTxt}
                </Button>
                {isSearching ? stopBtn : null}
              </ButtonToolbar>
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

export default SearchForm;

SearchForm.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
  onStopSearch: PropTypes.func.isRequired
};
