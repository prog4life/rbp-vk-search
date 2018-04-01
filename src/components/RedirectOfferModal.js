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

const propTypes = {
  delay: PropTypes.number.isRequired,
  onRedirectClick: PropTypes.func.isRequired,
};

class RedirectOfferModal extends React.Component {
  state = {
    isOpened: !this.props.delay,
  }
  componentDidMount() {
    const { delay } = this.props;

    if (delay) {
      setTimeout(() => this.setState({ isOpened: true }), delay);
    }
  }
  handleRedirectClick = () => {
    const { onRedirectClick } = this.props;

    this.setState({ isOpened: false });

    onRedirectClick();
  }
  handleLaterClick = () => {
    this.setState({ isOpened: false });
  }
  render() {
    const { isOpened } = this.state;

    return (
      <div className="redirect-offer-modal">
        {/* <Modal show={isOpened} onHide={this.handleClose}> */}
        <Modal show={isOpened}>
          <ModalHeader>
            <ModalTitle>
              {'Redirection for authentication'}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {`You must be logged in with vk.com to search.
              Redirect to login page now?`}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.handleRedirectClick}>
              {'Redirect'}
            </Button>
            <Button onClick={this.handleLaterClick}>
              {'Later'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

RedirectOfferModal.propTypes = propTypes;

export default RedirectOfferModal;
