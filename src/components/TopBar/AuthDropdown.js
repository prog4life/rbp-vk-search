import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavDropdown, MenuItem } from 'react-bootstrap';

import './style.scss';

const propTypes = {
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const AuthDropdown = ({ userId, userName }) => (
  <NavDropdown
    eventKey={1}
    id="topbar-nav-dropdown"
    title={userName ? `Signed in as: ${userName}` : 'Signed in'}
  >
    {userId && (
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
    )}
    <MenuItem eventKey={1.2}>
      {'Sign out'}
    </MenuItem>
  </NavDropdown>
);

AuthDropdown.propTypes = propTypes;

export default AuthDropdown;
