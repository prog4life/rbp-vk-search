import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import './style.scss';

const SignInNav = () => (
  <Nav pullRight>
    {/* TODO: invoke action with request instead href;
      // prevent repeated requests; add loading indicator or modal */}
    <NavItem
      className="topbar__sign-in-item"
      eventKey={2}
      href="#"
    >
      {'Sign in'}
    </NavItem>
  </Nav>
);

export default SignInNav;
