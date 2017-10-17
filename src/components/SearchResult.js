import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';

function SearchResult({ result, number }) {
  const {
    timestamp, fromId, postId, text, link
  } = result;

  const resultNumber = `[${number}]`;
  const linkText = 'Link to post at wall';
  const linkToUserPage = `https://vk.com/id${fromId}`;
  const postIdLabel = `[post id: ${postId}]`;
  const fromIdLabel = `[id${fromId}]`;

  return (
    <ListGroupItem>
      <span>{resultNumber}{' '}</span>
      <span className="post-timestamp">
        {new Date(timestamp).toLocaleString()}
      </span>
      <span>{' '}
        {postIdLabel}
      </span>
      <span>{' '}
        <a href={linkToUserPage} target="_blank">
          {fromIdLabel}
        </a>
      </span>
      <p>
        {text}{' '}
        <a href={link} target="_blank">{linkText}</a>
      </p>
    </ListGroupItem>
  );
}

export default SearchResult;

SearchResult.propTypes = {
  number: PropTypes.number.isRequired,
  result: PropTypes.shape({
    timestamp: PropTypes.number.isRequired,
    fromId: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }).isRequired
};
