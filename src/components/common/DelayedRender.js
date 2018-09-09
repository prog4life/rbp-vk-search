import React from 'react';
import PropTypes from 'prop-types';

class DelayedRender extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    delay: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    // this.makeVisibleAfterTimeout();
    const { delay } = this.props;

    this.timeout = setTimeout(() => this.setState({ isVisible: true }), delay);
  }

  // componentDidUpdate(prevProps) {
  //   const { delay } = this.props;
  //   const { delay: prevDelay } = prevProps;
  //
  //   if (this.timeout) {
  //     return;
  //   }
  //   this.makeVisibleAfterTimeout();
  // }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { children } = this.props;
    const { isVisible } = this.state;

    return isVisible ? children : null;
  }
}

export default DelayedRender;
