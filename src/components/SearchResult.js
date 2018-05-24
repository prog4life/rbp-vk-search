import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { ListGroupItem } from 'react-bootstrap';

function SearchResult({ result, number }) {
  const {
    timestamp, authorId, id, text, link,
  } = result;

  const resultNumber = `[${number}]`;
  const linkText = 'Link to post at wall';
  const linkToUserPage = `https://vk.com/id${authorId}`;
  const idLabel = `[post id: ${id}]`;
  const authorIdLabel = `[id${authorId}]`;
  const postDate = new Date(timestamp * 1000);
  const dayOfMonth = postDate.getDate();
  const month = postDate.getMonth() + 1;
  const year = postDate.getFullYear();
  const hours = postDate.getHours();
  const minutes = postDate.getMinutes();
  // const timestampString = postDate.toLocaleString('en-GB').slice(0, -3);

  return (
    <ListGroupItem>
      <span>
        {resultNumber}
        {' '}
      </span>
      <span className="post-timestamp">
        {/* {moment.unix(timestamp).format('D MMM YYYY  H:mm')} */}
        {`${dayOfMonth}-${month}-${year}`}
        {/* {timestampString} */}
      </span>
      {' '}
      <span className="post-timestamp">
        {`${hours}:${minutes}`}
      </span>
      <span>
        {' '}
        {idLabel}
      </span>
      <span>
        {' '}
        <a href={linkToUserPage} target="_blank">
          {authorIdLabel}
        </a>
      </span>
      <p>
        {text}
        {' '}
        <a href={link} target="_blank">
          {linkText}
        </a>
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
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};
