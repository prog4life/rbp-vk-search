import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

import './style.scss';

import TopBarNav from './TopBarNav';

const propTypes = {
  onNavSelect: PropTypes.func.isRequired,
};

const TopBar = ({ onNavSelect, ...restProps }) => (
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
      <TopBarNav {...restProps} />
    </Navbar.Collapse>
  </Navbar>
);

TopBar.propTypes = propTypes;

export default TopBar;
