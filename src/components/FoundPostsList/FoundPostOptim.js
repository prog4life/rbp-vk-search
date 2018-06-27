import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

import { makeTextualMonth, makeZeroedMinutes } from 'utils/dateFormat';

import './style.scss';

class FoundPostOptim extends React.Component {
  componentDidMount() {
    this.notify('MOUNTED');
  }
  componentDidUpdate() {
    this.notify('UPDATED');
  }
  notify(op) {
    const { post: { id }, number: resultNumber } = this.props;

    console.log(`Optim ${op}, number: ${resultNumber}, id: ${id}`);
  }
  render() {
    const { post, number: resultNumber } = this.props;
    const {
      timestamp, authorId, authorName, id, text, link, photo50, photo100,
      comments, likes, screenName, online,
    } = post;

    // TODO: add displayAvatar flag that will be false if post author id input present

    const linkText = 'Open at wall';
    const authorIdLabel = `id${authorId}`;
    const linkToUserPage = `https://vk.com/${screenName || authorIdLabel}`;
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
          <div className="found-post__number-wrapper">
            <span className="found-post__number">
              {resultNumber}
            </span>
          </div>
          <div className="found-post__timestamp">
            <span className="found-post__date">
              {/* {moment.unix(timestamp).format('D MMM YYYY  H:mm')} */}
              {`${dayOfMonth} ${month} ${year}`}
              {/* {timestampString} */}
            </span>
            <span className="found-post__time">
              {`${hours}:${minutes}`}
            </span>
          </div>
          {/* TODO: Remove left auto margin when > xs */}
          <div className="found-post__label">
            <span className="found-post__label-name">
              {'Author'}
            </span>
            <a
              className="found-post__label-info"
              href={linkToUserPage}
              target="_blank"
            >
              {authorName || authorIdLabel}
            </a>
          </div>
          <div className="found-post__label">
            <span className="found-post__label-name">
              {'Comments'}
            </span>
            <span className="found-post__label-info">
              {comments}
            </span>
          </div>
          <div className="found-post__label">
            <span className="found-post__label-name">
              {'Likes'}
            </span>
            <span className="found-post__label-info">
              {likes}
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
}

FoundPostOptim.propTypes = {
  number: PropTypes.number.isRequired,
  post: PropTypes.shape({
    timestamp: PropTypes.number.isRequired,
    authorId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

export default FoundPostOptim;
