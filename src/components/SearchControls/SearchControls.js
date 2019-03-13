import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Row, Col } from 'react-bootstrap';

import './style.scss';

import SearchControlButtons from './SearchControlButtons';
import SearchStatus from './SearchStatus';

class SearchControls extends Component {
  handleStopClick = (e) => {
    e.preventDefault();
    const { terminateSearch } = this.props;

    terminateSearch();
  }

  render() {
    const {
      isSearchActive,
      isSearchCompleted,
      itemsName,
      processed,
      total,
      progress,
    } = this.props;

    return (
      <div className="search-controls">
        <Row>
          <Col xs={12} sm={6} md={6} lg={4}>
            {(isSearchActive || isSearchCompleted)
              && (
                <div className="search-controls__progress-viewer">
                  <SearchStatus
                    isActive={isSearchActive}
                    isCompleted={isSearchCompleted}
                    processed={processed}
                    total={total}
                    name={itemsName}
                  />
                  <ProgressBar
                    bsStyle="info"
                    className="search-controls__progress-bar"
                    label={Number.isFinite(progress) ? `${progress}%` : ''}
                    now={Number.isFinite(progress) ? progress : undefined}
                  />
                </div>
              )
            }
          </Col>
          <Col xs={12} sm={6} md={6} lg={8}>
            <SearchControlButtons
              isSearchActive={isSearchActive}
              onStopClick={this.handleStopClick}
            />
          </Col>
          {/* TODO: add RESET button for completed state ? and think over
            search terminating before unmount */}
        </Row>
      </div>
    );
  }
}

SearchControls.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  isSearchCompleted: PropTypes.bool.isRequired,
  itemsName: PropTypes.string,
  processed: PropTypes.number.isRequired,
  progress: PropTypes.number,
  terminateSearch: PropTypes.func.isRequired,
  total: PropTypes.number,
};

SearchControls.defaultProps = {
  itemsName: 'items',
  progress: null,
  total: null,
};

export default SearchControls;
