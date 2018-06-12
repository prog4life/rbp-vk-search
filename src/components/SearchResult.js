import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { ListGroupItem } from 'react-bootstrap';

import { makeTextualMonth, makeZeroedMinutes } from 'utils/dateFormat';

function SearchResult({ result, number }) {
  const {
    timestamp, authorId, id, text, link,
  } = result;

  const resultNumber = `${number}`;
  const linkText = 'Open at wall';
  const linkToUserPage = `https://vk.com/id${authorId}`;
  // const idLabel = `[post id: ${id}]`;
  const authorIdLabel = `id${authorId}`;
  const postDate = new Date((timestamp * 1000) + (1000 * 60 * 418));
  // const postDate = new Date(1487830000000 + (1000 * 60 * 60 * 18));
  // postDate.setMonth(8);
  // postDate.setHours(23);
  // postDate.setMinutes(58);
  // postDate.setYear(2015);
  const dayOfMonth = postDate.getDate();
  const month = makeTextualMonth(postDate);
  const year = postDate.getFullYear();
  const hours = postDate.getHours();
  const minutes = makeZeroedMinutes(postDate);
  // const timestampString = postDate.toLocaleString('en-GB').slice(0, -3);

  return (
    <ListGroupItem>
      <div className="search-result__title">
        <div style={{
          marginRight: '5px',
          // padding: '0 4px',
          // backgroundColor: '#dedede',
          textAlign: 'center',
          // fontWeight: '600',
          // flex: '1',
        }}
        >
          <span style={{
            padding: '0 4px',
            backgroundColor: '#dedede',
            // textAlign: 'center',
            fontWeight: '600',
          }}
          >
            {resultNumber}
          </span>
        </div>
        <div style={{ minWidth: '180px' }}>
          <span className="post-timestamp">
            {/* {moment.unix(timestamp).format('D MMM YYYY  H:mm')} */}
            {`${dayOfMonth} ${month} ${year}`}
            {/* {timestampString} */}
          </span>
          <span className="post-timestamp">
            {`${hours}:${minutes}`}
          </span>
        </div>
        {/* <span>
          {idLabel}
        </span> */}
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ border: '1px solid #dedede' }}>
            <span style={{
              // marginRight: '5px',
              padding: '0 3px',
              backgroundColor: '#dedede',
              textAlign: 'center',
            }}
            >
              {'Author'}
            </span>
            <a
              style={{ padding: '0 8px' }}
              href={linkToUserPage}
              target="_blank"
            >
              {authorIdLabel}
            </a>
          </span>
        </div>
      </div>
      <div className="search-result__content">
        <p style={{ paddingRight: '8px' }}>
          {text}
        </p>
        {/* TODO: change textAlign to right at xxl braekpoint */}
        <div style={{ minWidth: '10%', textAlign: 'center' }}>
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


// const searchResultsTitle = (
//   <div className="search-result__title">
//     <span style={{
//       marginRight: '5px',
//       padding: '0 4px',
//       backgroundColor: '#dedede',
//       textAlign: 'center',
//       fontWeight: '600',
//     }}
//     >
//       {resultNumber}
//     </span>
//     <span className="post-timestamp">
//       {/* {moment.unix(timestamp).format('D MMM YYYY  H:mm')} */}
//       {`${dayOfMonth} ${month} ${year}`}
//       {/* {timestampString} */}
//     </span>
//     <span className="post-timestamp">
//       {`${hours}:${minutes}`}
//     </span>
//     {/* <span>
//       {idLabel}
//     </span> */}
//     <span style={{ border: '1px solid #dedede', margin: '0 5px' }}>
//       <span style={{
//         // marginRight: '5px',
//         padding: '0 3px',
//         backgroundColor: '#dedede',
//         textAlign: 'center',
//       }}
//       >
//         {'Author'}
//       </span>
//       <a
//         style={{ padding: '0 5px' }}
//         href={linkToUserPage}
//         target="_blank"
//       >
//         {authorIdLabel}
//       </a>
//     </span>
//   </div>
// );
