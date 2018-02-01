import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonToolbar, Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import FormFieldGroup from './FormFieldGroup';

class SearchForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleStopBtnClick = this.handleStopBtnClick.bind(this);

    this.state = {
      wallOwnerId: '',
      wallOwnerDomain: '',
      wallOwnerType: 'group',
      searchQuery: '',
      authorId: '',
      postsLimit: ''
    };
  }
  handleSubmit(event) {
    event.preventDefault();
    const { isSearching, onStartSearch } = this.props;

    if (isSearching) {
      return;
    }

    const {
      wallOwnerId,
      wallOwnerDomain,
      wallOwnerType,
      searchQuery,
      authorId,
      postsLimit
    } = event.target.elements;

    // TODO: rename "Domain" to "Screen Name" or "Short Name"

    onStartSearch({
      wallOwnerId: wallOwnerId.value,
      wallOwnerDomain: wallOwnerDomain.value,
      wallOwnerType: wallOwnerType.value,
      searchQuery: searchQuery.value,
      authorId: authorId.value,
      postsLimit: postsLimit.value
    });
  }
  handleTextInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleStopBtnClick() {
    const { isSearching, onStopSearch } = this.props;
    if (isSearching) {
      onStopSearch();
    }
  }
  render() {
    const {
      wallOwnerId,
      wallOwnerDomain,
      wallOwnerType,
      searchQuery,
      authorId,
      postsLimit
    } = this.state;
    const { isSearching } = this.props;

    const searchBtnTxt = isSearching ? 'Searching...' : 'Start Search';
    const stopBtnTxt = 'Stop Search';
    const stopBtn = (
      <Button onClick={this.handleStopBtnClick} type="button">
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
                id="postsLimit"
                label="Amount of search results to show"
                onChange={this.handleTextInputChange}
                placeholder="number of results"
                type="text"
                value={postsLimit}
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

SearchForm.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  onStartSearch: PropTypes.func.isRequired,
  onStopSearch: PropTypes.func.isRequired
};

export default SearchForm;

