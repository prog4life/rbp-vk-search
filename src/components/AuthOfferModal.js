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
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
  }

  state = {
    isOpened: true,
  }

  handleConfirmation = () => {
    const { onConfirm } = this.props;

    onConfirm();
    this.setState({ isOpened: false });
  }

  handleReject = () => {
    const { onReject } = this.props;

    onReject();
    this.setState({ isOpened: false });
  }

  render() {
    const { isOpened } = this.state;

    return (
      // onHide={this.handleHide}
      <Modal show={isOpened}>
        <ModalHeader>
          <ModalTitle>
            {'Authentication request'}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {`You must be logged in with vk.com to search.
              Sign in now? (vk.com auth popup may be opened)`}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleConfirmation}>
            {'Sign In'}
          </Button>
          <Button onClick={this.handleReject}>
            {'Later'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AuthOfferModal;
