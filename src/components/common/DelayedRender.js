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
      isVisible: !props.delay,
    };
  }
  componentDidMount() {
    const { delay } = this.props;

    if (!Number.isInteger(delay)) {
      throw new Error('Expected delay to be an integer');
    }
    this.timeout = setTimeout(() => this.setState({ isVisible: true }), delay);
  }
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
