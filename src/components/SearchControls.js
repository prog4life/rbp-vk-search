import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, ButtonToolbar, Button } from 'react-bootstrap';

// import SearchControlButtons from 'components/SearchControlButtons';
import ProgressViewer from 'components/ProgressViewer';
import SearchStatus from 'components/SearchStatus';

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
      isSearchCompleted,
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
        {/* TODO: add RESET button for completed state ? */}
        <ButtonToolbar className="search-controls__search-buttons">
          {isSearchActive
            ?
              <Button
                onClick={this.handleStopClick}
                type="button"
              >
                {'Stop Search'}
              </Button>
            :
              <Button
                bsStyle="info"
                type="submit"
              >
                {'Start Search'}
              </Button>
          }
        </ButtonToolbar>
        {(isSearchActive || isSearchCompleted) &&
          // TODO: rename to StatusViewer
          <ProgressViewer className="search-controls__progress-viewer">
            {/* TODO: or ProgressTextInfo/ProgressMessage */}
            <SearchStatus
              isActive={isSearchActive}
              isCompleted={isSearchCompleted}
              processed={processed}
              total={total}
              name={itemsName}
            />
            <ProgressBar
              bsStyle="info"
              className="progress-viewer__progress-bar"
              label={Number.isFinite(progress) ? `${progress}%` : ''}
              now={Number.isFinite(progress) ? progress : undefined}
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
//     <p className="search-status">
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
