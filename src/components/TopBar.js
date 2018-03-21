import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
// TODO: try
// import {
//   Navbar, NavbarText, NavbarLink, NavbarHeader, NavbarBrand, NavbarCollapse,
// } from 'react-bootstrap';
import { tokenRequestURL } from 'config/common';

import NavAuth from 'components/NavAuth';

const propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onNavSelect: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const TopBar = ({ userId, userName, isLoggedIn, onNavSelect }) => {
  const singleSignIn = (
    <Navbar.Text className="topbar__sign-in" pullRight>
      {/* TODO: invoke action with request instead href;
      prevent repeated requests; add loading indicator */}
      <Navbar.Link href={tokenRequestURL}>
        {'Sign in'}
      </Navbar.Link>
    </Navbar.Text>
  );

  return (
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
          : singleSignIn
        }
      </Navbar.Collapse>
    </Navbar>
  );
};

TopBar.propTypes = propTypes;

export default TopBar;
