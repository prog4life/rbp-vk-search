import React from 'react';
import PropTypes from 'prop-types';

class AuthErrorBoundary extends React.Component {
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
      return null; // TODO: render some error message
    }
    return children;
  }
}

export default AuthErrorBoundary;
