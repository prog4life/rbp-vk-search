import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { tokenRequestURL } from 'config/common';

const renderNavDropdown = userId => (
  <Nav className="nav-auth" pullRight>
    <NavDropdown
      eventKey={1}
      id="signed-in-dropdown"
      title={userId ? `Signed in as: ${userId}` : 'Signed in'}
    >
      {userId &&
        <Fragment>
          <MenuItem
            eventKey={1.1}
            href={`https://vk.com/id${userId}`}
            target="blank"
            title="Open your vk.com page in new tab"
          >
            {'Profile'}
          </MenuItem>
          <MenuItem divider />
        </Fragment>
      }
      <MenuItem eventKey={1.2}>
        {'Sign out'}
      </MenuItem>
    </NavDropdown>
  </Nav>
);

const renderSingleNavItem = () => (
  <Navbar.Text className="navitem" pullRight>
    {/* TODO: clean up, remove href */}
    <Navbar.Link href={tokenRequestURL.replace('state=55555', `state=${Date.now().toString()}`)}>
      {'Sign in'}
    </Navbar.Link>
  </Navbar.Text>
);

const TopBar = ({ userId, isLoggedIn, onNavSelect }) => (
  <Navbar fixedTop onSelect={onNavSelect}>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">
          {'VK SEARCH'}
        </Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      {isLoggedIn ? renderNavDropdown(userId) : renderSingleNavItem()}
    </Navbar.Collapse>
  </Navbar>
);

export default TopBar;