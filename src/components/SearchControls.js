import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, ButtonToolbar, Button } from 'react-bootstrap';
import Spinner from 'react-spinner-material';

// import SearchControlButtons from 'components/SearchControlButtons';
import ProgressViewer from 'components/ProgressViewer';

class SearchControls extends Component {
  // componentWillUnmount() {
  //   const { terminateSearch } = this.props;

  //   terminateSearch();
  // }
  handleStopClick = (e) => {
    e.preventDefault();
    const { terminateSearch } = this.props;

    terminateSearch();
  }
  render() {
    const {
      isSearchActive,
      itemsName,
      processed,
      total,
      progress,
    } = this.props;

    return (
      // TODO: replace Fragment by container div with margin-bottom equal to
      // FormGroup margin-bottom ?
      <div className="search-controls">
        {/* <SearchControlButtons
          isSearchActive={isSearchActive}
          onStopClick={terminateSearch}
        /> */}
        <ButtonToolbar className="search-controls__search-buttons">
          {isSearchActive
            ?
              <div>
                <Spinner
                  size={20}
                  spinnerColor={"#333"}
                  spinnerWidth={2}
                  visible
                />
                <Button
                  onClick={this.handleStopClick}
                  type="button"
                >
                  {'Stop Search'}
                </Button>
              </div>
            :
              <Button // TODO: change to onClick instead of submit
                bsStyle="info"
                type="submit"
              >
                {'Start Search'}
              </Button>
          }
        </ButtonToolbar>
        {isSearchActive &&
          <ProgressViewer className="search-controls__progress-viewer">
            {/* TODO: extract component ProgressTextInfo, change className to __progress-text */}
            <p className="progress-viewer__processed-info">
              {processed && total
                ? `Processed ${processed} of ${total} ${itemsName}`
                : 'Search in progress'
              }
            </p>
            <ProgressBar
              bsStyle="info"
              className="progress-viewer__progress-bar"
              label={Number.isFinite(progress) ? `${progress}%` : ''}
              now={progress || undefined}
            />
          </ProgressViewer>
        }
      </div>
    );
  }
}

// const preProgViewer = (
//   <div className="progress-viewer">
//     {/* TODO: extract component ProgressTextInfo, change className to __progress-text */}
//     <p className="progress-viewer__processed-info">
//       {processed && total
//         ? `Processed ${processed} of ${total} ${itemsName}`
//         : 'Search in progress'
//       }
//     </p>
//     <ProgressBar
//       bsStyle="info"
//       className="progress-viewer__progress-bar"
//       label={Number.isFinite(progress) ? `${progress}%` : ''}
//       now={progress || undefined}
//     />
//   </div>
// );

SearchControls.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  itemsName: PropTypes.string,
  processed: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  terminateSearch: PropTypes.func.isRequired,
  total: PropTypes.number,
};

SearchControls.defaultProps = {
  itemsName: 'items',
  // progress: null,
  total: null,
};

export default SearchControls;
