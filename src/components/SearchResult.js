import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { ListGroupItem } from 'react-bootstrap';

function SearchResult({ result, number }) {
  const {
    timestamp, authorId, id, text, link,
  } = result;

  // const resultNumber = `[${number}]`;
  const resultNumber = `${number}`;
  const linkText = 'Open at wall';
  const linkToUserPage = `https://vk.com/id${authorId}`;
  const idLabel = `[post id: ${id}]`;
  const authorIdLabel = `[id${authorId}]`;
  const postDate = new Date(timestamp * 1000);
  // const postDate = new Date(1487830000000);
  // postDate.setMonth(11);
  // postDate.setHours(4);
  // postDate.setMinutes(8);
  // postDate.setYear(2015);
  const dayOfMonth = postDate.getDate();
  const incrMonth = postDate.getMonth() + 1;
  const monthMap = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };
  // const month = incrMonth < 10 ? `0${incrMonth}` : incrMonth;
  const month = monthMap[incrMonth];
  const year = postDate.getFullYear();
  const rawHours = postDate.getHours();
  const hours = rawHours < 10 ? `0${rawHours}` : rawHours;
  const rawMinutes = postDate.getMinutes();
  const minutes = rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes;
  // const timestampString = postDate.toLocaleString('en-GB').slice(0, -3);

  return (
    <ListGroupItem>
      <div className="search-result__title">
        <span style={{
          marginRight: '5px',
          padding: '0 4px',
          backgroundColor: '#dedede',
          textAlign: 'center',
          fontWeight: '600',
        }}
        >
          {resultNumber}
          {/* {' '} */}
        </span>
        <span className="post-timestamp">
          {/* {moment.unix(timestamp).format('D MMM YYYY  H:mm')} */}
          {`${dayOfMonth} ${month} ${year}`}
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
      </div>
      <div className="search-result__content">
        <p>
          {text}
          {' '}
        </p>
        <div>
          <a href={link} target="_blank">
            {linkText}
          </a>
        </div>
      </div>
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
