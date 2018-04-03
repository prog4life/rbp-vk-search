import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }
  state = {
    hasError: false,
  }
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }
  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return null;
    }
    return children;
  }
}

export default ErrorBoundary;
