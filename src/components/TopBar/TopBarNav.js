import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem, Nav, NavItem } from 'react-bootstrap';
import Spinner from 'components/common/Spinner';

import NavItemLink from './NavItemLink';

const propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  userPage: PropTypes.string.isRequired,
};

// NOTE: eventKey prop was not working if MenuItems? were nested into
// some other component or even Fragment. Array is used to render MenuItems

const TopBarNav = ({ isLoggedIn, isAuthenticating, userPage, userName }) => {
  const navDropdown = (
    <NavDropdown
      eventKey={1}
      id="topbarnav-dropdown"
      title={userName || 'Signed in'}
    >
      {userPage && [ // see NOTE above, TODO: try without array
        <MenuItem
          key="1.1.0"
          eventKey={1.1}
          href={userPage}
          target="blank"
          title="Open your vk.com page in new tab"
        >
          {'Your page'}
        </MenuItem>,
        <MenuItem key="1.1.1" divider />,
      ]}
      <MenuItem eventKey={1.2}>
        {'Sign out'}
      </MenuItem>
    </NavDropdown>
  );

  const authLoaderAndText = (
    <Fragment>
      <Spinner spinColor="#000" spinAlignment="left" />
      <span className="topbarnav__authentication">
        {'Authentication'}
      </span>
    </Fragment>
  );

  const singleNavItem = (
    <NavItem
      className="topbarnav__single"
      eventKey={2}
      href="#"
    >
      {isAuthenticating
        ? authLoaderAndText
        : 'Sign in'
      }
    </NavItem>
  );

  return (
    <Nav className="topbarnav" pullRight>
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
        : singleNavItem
      }
    </Nav>
  );
};

TopBarNav.propTypes = propTypes;

export default TopBarNav;
