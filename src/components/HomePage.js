import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section>
      <Link to="/wall-posts">{ 'Search for posts at wall' }</Link>
      <br />
      <Link to="/wall-comments">{ 'Search for comments at wall' }</Link>
    </section>
  );
};

export default HomePage;
