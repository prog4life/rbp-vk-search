import React from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';

// import './style.scss';

import NavItemLink from './NavItemLink';

const propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

// NOTE: eventKey prop was not working if NavItem | NavDropdown was nested into
// some other component or even Fragment. Array is used to render MenuItems

const TopBarNav = ({ isLoggedIn, userId, userName }) => {
  const navDropdown = (
    <NavDropdown
      eventKey={1}
      id="topbar-nav-dropdown"
      title={userName ? `Signed in as: ${userName}` : 'Signed in'}
    >
      {userId && [ // see NOTE above
        <MenuItem
          key="1.1.0"
          eventKey={1.1}
          href={`https://vk.com/id${userId}`}
          target="blank"
          title="Open your vk.com page in new tab"
        >
          {'Profile'}
        </MenuItem>,
        <MenuItem key="1.1.1" divider />,
      ]}
      <MenuItem eventKey={1.2}>
        {'Sign out'}
      </MenuItem>
    </NavDropdown>
  );

  const signInNavItem = (
    <NavItem
      className="topbar__sign-in"
      eventKey={2}
      href="#"
    >
      {/* TODO: prevent repeated requests, show redirection modal */}
      {'Sign in'}
    </NavItem>
  );

  return (
    <Nav className="topbar__nav" pullRight>
      <NavItemLink
        to="/"
        eventKey={3}
      >
        {'Wall Posts'}
      </NavItemLink>
      <NavItemLink
        to="/user-data"
        eventKey={4}
      >
        {'User Data'}
      </NavItemLink>
      {isLoggedIn
        ? navDropdown
        : signInNavItem
      }
    </Nav>
  );
};

TopBarNav.propTypes = propTypes;

export default TopBarNav;
