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

class AuthOfferModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onRedirect: PropTypes.func.isRequired,
  }
  state = {
    isOpened: true,
  }
  handleRedirectClick = () => {
    const { onRedirect } = this.props;

    onRedirect();

    this.setState({ isOpened: false });
  }
  handleClose = () => {
    const { onClose } = this.props;

    onClose();

    this.setState({ isOpened: false });
  }
  render() {
    const { isOpened } = this.state;

    return (
      // onHide={this.handleHide}
      <Modal show={isOpened}>
        <ModalHeader>
          <ModalTitle>
            {'Redirection for authentication'}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {`You must be logged in with vk.com to search.
              Redirect to sign in page now?`}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleRedirectClick}>
            {'Redirect'}
          </Button>
          <Button onClick={this.handleClose}>
            {'Later'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AuthOfferModal;
