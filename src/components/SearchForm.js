import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button, Grid, Row, Col } from 'react-bootstrap';

import FormFieldGroup from './FormFieldGroup';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);

    this.state = {
      wallOwnerId: '',
      wallOwnerDomain: '',
      searchQuery: '',
      authorId: '',
      postsAmount: ''
    };
  }
  handleSubmit(event) {
    event.preventDefault();

    if (this.props.isSearching) {
      this.props.onTerminateSearch();
      return;
    }

    const {
      wallOwnerId, wallOwnerDomain, searchQuery, authorId, postsAmount
    } = event.target.elements;

    this.props.onStartSearch({
      wallOwnerId: wallOwnerId.value,
      wallOwnerDomain: wallOwnerDomain.value,
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
      searchQuery,
      authorId,
      postsAmount
    } = this.state;
    const { isSearching } = this.props;

    const searchBtnTxt = isSearching ? 'Searching...' : 'Start Search';
    const stopBtnTxt = 'Terminate Search';
    const stopBtn = <Button type="submit">{stopBtnTxt}</Button>;

    return (
      <Grid>
        <form onSubmit={this.handleSubmit}>
          <Row>
            {/*  TODO: use names instead of id's */}
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="wallOwnerId"
                type="text"
                value={wallOwnerId}
                label="Wall owner id (user or group)"
                placeholder="wall owner id"
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="wallOwnerDomain"
                type="text"
                value={wallOwnerDomain}
                label="Short name of wall owner (instead of id)"
                placeholder="wall owner textual id"
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="searchQuery"
                type="text"
                value={searchQuery}
                label="Text to search in post (optional, disabled)"
                placeholder="text to search"
                disabled
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="authorId"
                type="text"
                value={authorId}
                label="Post author id, which posts to search (required)"
                placeholder="post author id"
                required
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="searchOffset"
                type="text"
                value=""
                label="Show posts starting from this number of result"
                placeholder="start from post number"
              />
            </Col>
            <Col xs={10} sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="postsAmount"
                type="text"
                value={postsAmount}
                label="Amount of search results to show"
                placeholder="number of results"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} lg={4} mdOffset={6} lgOffset={8}>
              <ButtonToolbar>
                <Button
                  type="submit"
                  bsStyle="info"
                  disabled={isSearching}
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
  onTerminateSearch: PropTypes.func.isRequired
};
