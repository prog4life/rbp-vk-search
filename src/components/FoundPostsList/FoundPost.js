import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

import { makeTextualMonth, makeZeroedMinutes } from 'utils/dateFormat';

import './style.scss';

// TODO: rename to SearchedPostResult or FoundPost

function FoundPost({ post, number }) {
  const {
    timestamp, authorId, id, text, link, photo50, photo100,
  } = post;

  // TODO: add displayAvatar flag that will be false if post author id input present

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
    <Fragment>
      <div className="found-post__title">
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
          <span className="found-post__timestamp">
            {/* {moment.unix(timestamp).format('D MMM YYYY  H:mm')} */}
            {`${dayOfMonth} ${month} ${year}`}
            {/* {timestampString} */}
          </span>
          <span className="found-post__timestamp">
            {`${hours}:${minutes}`}
          </span>
        </div>
        {/* <span>
          {idLabel}
        </span> */}
        {/* TODO: Remove left auto margin when > xs */}
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
              style={{ padding: '0 10px' }}
              href={linkToUserPage}
              target="_blank"
            >
              {authorIdLabel}
            </a>
          </span>
        </div>
      </div>
      <div className="found-post__content">
        {photo50 &&
          <div style={{ marginTop: '5px' }}>
            <a href={linkToUserPage} target="_blank">
              <img src={photo50} alt="user-avatar" />
            </a>
          </div>
        }
        <p style={{ flex: 9, padding: '0 8px' }}>
          {text}
        </p>
        {/* TODO: add minWidth and change textAlign to right at xxl braekpoint */}
        <div style={{
          // minWidth: '10%',
          flex: 1,
          textAlign: 'center',
          // paddingLeft: '8px',
        }}
        >
          <a href={link} target="_blank">
            {linkText}
          </a>
        </div>
      </div>
    </Fragment>
  );
}

FoundPost.propTypes = {
  number: PropTypes.number.isRequired,
  post: PropTypes.shape({
    timestamp: PropTypes.number.isRequired,
    authorId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

export default FoundPost;
