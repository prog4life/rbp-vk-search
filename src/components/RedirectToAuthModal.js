import React from 'react';
import {
  ModalDialog,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from 'react-bootstrap';

const RedirectToAuthModal = props => (
  <div className="redirect-to-auth-modal">
    {/* <Modal show={this.state.isOpened} onHide={this.handleClose}> */}
    <ModalDialog>
      <ModalHeader>
        <ModalTitle>
          {'Redirection for authentication'}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        {'You are redirected to vk.com login page'}
      </ModalBody>
      <ModalFooter>
        <Button onClick={(e) => {}}>
          {'Close'}
        </Button>
      </ModalFooter>
    </ModalDialog>
    {/* </Modal> */}
  </div>
);

export default RedirectToAuthModal;
