import React from 'react';
import pT from 'prop-types';
import { NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavItemLink = ({ to, children, ...restProps }) => (
  <NavItem
    componentClass={Link}
    href={to}
    to={to}
    {...restProps}
  >
    {children}
  </NavItem>
);

NavItemLink.propTypes = {
  children: pT.node.isRequired,
  to: pT.string.isRequired,
};

export default NavItemLink;
