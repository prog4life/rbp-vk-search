import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

import { makeTextualMonth, makeZeroedMinutes } from 'utils/dateFormat';

import './style.scss';

// NOTE: number prop is one that cases component rerendering/updating

class FoundPostOptim extends React.Component {
  componentDidMount() {
    // this.notify('MOUNTED');
  }

  // componentDidUpdate(prevProps) {
  //   this.notify('UPDATED');

  //   const keys = Object.keys(prevProps);

  //   keys.forEach((propKey) => {
  //     const prevProp = prevProps[propKey];
  //     const currProp = this.props[propKey];

  //     if (prevProp === currProp) return;
  //     console.log(`${propKey} `, prevProp, ' !== ', currProp);
  //   });
  // }

  // componentWillUnmount() {
  //   this.notify('UNMOUNT');
  // }

  notify(op) {
    const { post: { id }, number: resultNumber, usual } = this.props;

    console.log(`FoundPostOptim ${usual ? 'USUAL' : ''} ${op}, number: ${resultNumber}, id: ${id}`)
  }

  render() {
    const { post, number: resultNumber } = this.props;
    const {
      timestamp, authorId, authorName, id, text, link, photo50, photo100,
      comments, likes, screenName, online, deactivated,
    } = post;

    // TODO: make all date and time formatting/computation in formatPosts or selectors

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
              rel="noopener noreferrer"
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
          {photo50 && (
            <div style={{ marginTop: '5px' }}>
              <a href={linkToUserPage} target="_blank" rel="noopener noreferrer">
                <img src={photo50} alt="user-avatar" />
              </a>
            </div>
          )}
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
            <a href={link} target="_blank" rel="noopener noreferrer">
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
    authorId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
};

export default FoundPostOptim;
