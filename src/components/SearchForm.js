import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Checkbox, Button, Grid, Row, Col} from 'react-bootstrap';

import FormFieldGroup from './FormFieldGroup';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);

    this.state = {
      wallOwner: '',
      wallDomain: '',
      searchQuery: '',
      authorId: '',
      searchOffset: '',
      postsAmount: ''
    };
  }
  handleSubmit(event) {
    event.preventDefault();
    const {wallOwner, wallDomain, searchQuery, authorId, searchOffset,
      postsAmount} = event.target.elements;

    this.props.onSearch({
      wallOwner: wallOwner.value,
      wallDomain: wallDomain.value,
      searchQuery: searchQuery.value,
      authorId: authorId.value,
      searchOffset: searchOffset.value,
      postsAmount: postsAmount.value
    });
  }
  handleTextInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    }, () => console.info('New searchform state: ', this.state));
  }
  render() {
    const {wallOwner, wallDomain, searchQuery, authorId, searchOffset,
      postsAmount} = this.state;

    return (
      <Grid>
        <form onSubmit={this.handleSubmit}>
          <Row>
            {/*  TODO: use names instead of id's */}
            <Col sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="wallOwner"
                type="text"
                value={wallOwner}
                label="Wall owner id (user or group)"
                placeholder="wall owner id"
              />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="wallDomain"
                type="text"
                value={wallDomain}
                label="Short name of wall owner (instead of id)"
                placeholder="wall owner textual id"
              />
            </Col>
            <Col sm={6} lg={4}>
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
            <Col sm={6} lg={4}>
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
            <Col sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="searchOffset"
                type="text"
                value={searchOffset}
                label="Show posts starting from this number of result"
                placeholder="start from post number"
              />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                onChange={this.handleTextInputChange}
                id="postsAmount"
                type="text"
                value={postsAmount}
                label="Amount of search results to show"
                placeholder="number of results"
              />
            </Col>
            <Col xs={8} sm={6} md={8}>
              <FormGroup controlId="onlyOwner">
                <Checkbox readOnly disabled>
                  Search among owner{"'"}s posts only
                </Checkbox>
              </FormGroup>
            </Col>
            <Col xs={4} sm={6} md={4}>
              {/* TODO: Change to cancel button on loading */}
              {/* <Button bsStyle="info" disabled={isLoading}>
                    Start Search
                  </Button> */}
              <Button type="submit" bsStyle="info">
                Start Search
              </Button>
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

export default SearchForm;

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
};
