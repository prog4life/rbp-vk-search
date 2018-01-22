import React from 'react';
import { connect } from 'react-redux';
import { searchCommentsWithExecute } from 'actions';

const getObjectFromJSON = response => response.json();

const throwIfNotOk = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export class WallCommentsSearchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      response: null
    };
    this.handleCallAPIClick = this.handleCallAPIClick.bind(this);
  }
  // getCommentsViaExecute
  handleCallAPIClick() {
    const { dispatch } = this.props;

    dispatch(searchCommentsWithExecute())
      .then(getObjectFromJSON)
      .then(throwIfNotOk)
      .then(response => this.setState({ response }));
  }

  render() {
    const { response } = this.state;
    return (
      <div>
        <h3>{'Wall Comment Search Page'}</h3>
        <button onClick={this.handleCallAPIClick} type="button">
          {'Call API'}
        </button>
        <pre>
          <code>
            {response}
          </code>
        </pre>
      </div>
    );
  }
}

// const WallCommentsSearchPage = () => (
//   <div>
//     <h3>{'Wall Comment Search Page'}</h3>
//     <pre>
//       <code>{}</code>
//     </pre>
//   </div>
// );

export default connect()(WallCommentsSearchPage);
