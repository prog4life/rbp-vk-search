import React from 'react';
import {Form, FormGroup, Checkbox, Button, Grid, Row, Col} from 'react-bootstrap';

import FormFieldGroup from './FormFieldGroup';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(event) {
    event.preventDefault();

    this.props.handleSearch(event);
  }
  render() {
    return (
      <Grid>
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                id="wall-owner"
                type="text"
                label="ID of wall owner (user or group)"
                placeholder="wall owner id" />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                id="wall-domain"
                type="text"
                label="Short name of wall owner (instead of ID)"
                placeholder="wall owner textual id" />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                id="search-query"
                type="text"
                label="Text to search in post (optional, disabled)"
                placeholder="text to search"
                disabled={true} />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                id="author-id"
                type="text"
                label="ID of author, which posts search for (required)"
                placeholder="post author id"
                required={true} />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                id="search-offset"
                type="text"
                label="Show posts starting from this number of result"
                placeholder="start from post number" />
            </Col>
            <Col sm={6} lg={4}>
              <FormFieldGroup
                id="post-amount"
                type="text"
                label="Amount of search results to show"
                placeholder="number of results" />
            </Col>
            <Col xs={8} sm={6} md={8}>
              <FormGroup controlId="only-owner">
                <Checkbox readOnly disabled={true}>
                  Search among owner's posts only
                </Checkbox>
              </FormGroup>
            </Col>
            <Col xs={4} sm={6} md={4}>
              {/* TODO: Change to cancel button on loading */}
              {/* <Button bsStyle="info" disabled={isLoading}>
                    Start Search
                  </Button> */}
              {/* Pay attention to using type="submit" */}
              <Button type="submit" bsStyle="info">Start Search</Button>
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }
}

export default SearchForm;
