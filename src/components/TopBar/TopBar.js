import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import AuthDropdown from './AuthDropdown';
import SignInNavItem from './SignInNavItem';
import NavItemLink from './NavItemLink';

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
      <Nav className="topbar__nav" pullRight>
        <NavItemLink
          to="/user-data"
          eventKey={3}
        >
          {'User Data'}
        </NavItemLink>
        {isLoggedIn
          ? <AuthDropdown userId={userId} userName={userName} />
          : <SignInNavItem />
        }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

TopBar.propTypes = propTypes;

export default TopBar;
