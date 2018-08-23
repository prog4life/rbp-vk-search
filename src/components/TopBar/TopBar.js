import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

import './style.scss';

import TopBarNav from './TopBarNav';

const propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onNavSelect: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const TopBar = ({ userId, userName, isLoggedIn, onNavSelect }) => (
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
      <TopBarNav isLoggedIn={isLoggedIn} userId={userId} userName={userName} />
    </Navbar.Collapse>
  </Navbar>
);

TopBar.propTypes = propTypes;

export default TopBar;
