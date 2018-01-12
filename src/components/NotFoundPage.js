import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div>
    <span>{'Cant\'t find such page! Back to '}</span>
    <Link to="/">{'Home Page'}</Link>
  </div>
);

export default NotFoundPage;
