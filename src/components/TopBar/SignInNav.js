import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import './sign-in-nav.scss';

const SignInNav = () => (
  <Nav pullRight>
    {/* TODO: invoke action with request instead href;
      // prevent repeated requests; add loading indicator or modal */}
    <NavItem
      className="sign-in-nav__nav-item"
      eventKey={2}
      href="#"
    >
      {'Sign in'}
    </NavItem>
  </Nav>
);

export default SignInNav;
