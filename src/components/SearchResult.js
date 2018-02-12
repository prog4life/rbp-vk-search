import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ListGroupItem } from 'react-bootstrap';

function SearchResult({ result, number }) {
  const {
    timestamp, authorId, postId, text, link
  } = result;

  const resultNumber = `[${number}]`;
  const linkText = 'Link to post at wall';
  const linkToUserPage = `https://vk.com/id${authorId}`;
  const postIdLabel = `[post id: ${postId}]`;
  const authorIdLabel = `[id${authorId}]`;

  return (
    <ListGroupItem>
      <span>{resultNumber}{' '}</span>
      <span className="post-timestamp">
        {/* {new Date(timestamp * 1000).toLocaleString()} */}
        {moment.unix(timestamp).format('D MMM YYYY  H:mm')}
      </span>
      <span>{' '}
        {postIdLabel}
      </span>
      <span>{' '}
        <a href={linkToUserPage} target="_blank">
          {authorIdLabel}
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
    authorId: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }).isRequired
};
