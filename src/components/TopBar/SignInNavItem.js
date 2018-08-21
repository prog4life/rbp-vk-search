import React from 'react';
import { NavItem } from 'react-bootstrap';

import './style.scss';

const SignInNavItem = () => (
  <NavItem
    className="topbar__sign-in"
    eventKey={2}
    href="#"
  >
    {/* TODO: invoke action with request instead href;
      // prevent repeated requests; add loading indicator or modal */}
    {'Sign in'}
  </NavItem>
);

export default SignInNavItem;
