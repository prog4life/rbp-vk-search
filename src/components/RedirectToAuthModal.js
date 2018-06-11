import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from 'react-bootstrap';

class RedirectToAuthModal extends React.Component {
  static propTypes = {
    isRedirecting: PropTypes.bool.isRequired,
    onCancelRedirect: PropTypes.func.isRequired,
    onRedirectClick: PropTypes.func.isRequired,
  }
  state = {
    isOpened: true,
  }
  handleRedirectClick = () => {
    const { onRedirectClick } = this.props;

    // this.setState({ isOpened: false });

    onRedirectClick();
  }
  handleClose = () => {
    const { isRedirecting, onCancelRedirect } = this.props;
    // TODO: dispatch "reject auth redirect" to set "hasAuthOffer" to false
    if (!isRedirecting) {
      onCancelRedirect();
    }

    this.setState({ isOpened: false });
  }
  render() {
    const { isOpened } = this.state;
    const { isRedirecting } = this.props;

    return (
      <div className="redirect-offer-modal">
        {/* <Modal show={isOpened} onHide={this.handleClose}> */}
        <Modal show={isOpened}>
          <ModalHeader>
            <ModalTitle>
              {isRedirecting
                ? 'Redirecting...'
                : 'Redirection for authentication'
              }
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {isRedirecting
              ? 'Wait please. You will sign in soon'
              : `You must be logged in with vk.com to search.
                Redirect to sign in page now?`
            }
          </ModalBody>
          <ModalFooter>
            {isRedirecting ||
              <Button onClick={this.handleRedirectClick}>
                {'Redirect'}
              </Button>
            }
            <Button onClick={this.handleClose}>
              {isRedirecting ? 'OK' : 'Later'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RedirectToAuthModal;
