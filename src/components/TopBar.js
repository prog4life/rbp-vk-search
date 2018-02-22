import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { tokenRequestURL } from 'config/common';

const renderNavDropdown = (userId, userName) => (
  <Nav className="nav-auth" pullRight>
    <NavDropdown
      eventKey={1}
      id="signed-in-dropdown"
      title={userName ? `Signed in as: ${userName}` : 'Signed in'}
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
    {/* TODO: clean up, change href */}
    <Navbar.Link href={tokenRequestURL}>
      {'Sign in'}
    </Navbar.Link>
  </Navbar.Text>
);

const TopBar = ({ userId, userName, isLoggedIn, onNavSelect }) => (
  <Navbar fixedTop onSelect={onNavSelect}>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">
          {'VK SEARCH'}
        </Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      {isLoggedIn ? renderNavDropdown(userId, userName) : renderSingleNavItem()}
    </Navbar.Collapse>
  </Navbar>
);

export default TopBar;
