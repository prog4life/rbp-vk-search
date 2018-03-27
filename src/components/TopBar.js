import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem  } from 'react-bootstrap';
// TODO: try
// import {
//   Navbar, NavbarText, NavbarLink, NavbarHeader, NavbarBrand, NavbarCollapse,
// } from 'react-bootstrap';

import NavAuth from 'components/NavAuth';

const propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onNavSelect: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const TopBar = ({ userId, userName, isLoggedIn, onNavSelect }) => {
  const signInNav = (
    <Nav pullRight>
      {/* TODO: invoke action with request instead href;
        // prevent repeated requests; add loading indicator or modal */}
      <NavItem
        className="topbar__sign-in"
        eventKey={2}
        href="#"
      >
        {'Sign in'}
      </NavItem>
    </Nav>
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
          : signInNav
        }
      </Navbar.Collapse>
    </Navbar>
  );
};

TopBar.propTypes = propTypes;

export default TopBar;
