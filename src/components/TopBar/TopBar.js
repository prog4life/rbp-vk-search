import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

import NavAuth from './NavAuth';
import SignInNav from './SignInNav';

const propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onNavSelect: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

// TODO: use ...rest when onSignIn will be added
const TopBar = ({ userId, userName, isLoggedIn, onNavSelect }) => (
  <Navbar fixedTop onSelect={onNavSelect}>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">
          {'VK SEARCH'}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {isLoggedIn
        ? <NavAuth userId={userId} userName={userName} />
        : <SignInNav />
      }
    </Navbar.Collapse>
  </Navbar>
);

TopBar.propTypes = propTypes;

export default TopBar;
