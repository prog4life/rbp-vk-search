import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from 'react-bootstrap';

class RedirectToAuthModal extends React.Component {
  state = {
    isOpened: true,
  }
  handleOkClick = () => {
    this.setState({ isOpened: false });
  }
  render() {
    const { isOpened } = this.state;

    return (
      <div className="redirect-to-auth-modal">
        {/* <Modal show={isOpened} onHide={this.handleClose}> */}
        <Modal show={isOpened}>
          <ModalHeader>
            <ModalTitle>
              {'Redirection for authentication'}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {'You will be redirected to vk.com login page or signed in. Please wait'}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.handleOkClick}>
              {'OK'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RedirectToAuthModal;
