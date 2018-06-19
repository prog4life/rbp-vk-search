import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from 'react-bootstrap';

class AuthRedirectModal extends React.Component {
  state = {
    isOpened: true,
  }
  handleClose = () => {
    this.setState({ isOpened: false });
  }
  render() {
    const { isOpened } = this.state;

    return (
      // onHide={this.handleHide}
      <Modal show={isOpened}>
        <ModalHeader>
          <ModalTitle>
            {'Redirecting...'}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {'Wait please. You will sign in soon'}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleClose}>
            {'OK'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AuthRedirectModal;
