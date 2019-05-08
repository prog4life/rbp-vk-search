// import { compose } from 'redux';
import { normalize } from 'normalizr';
import schemas, { targets } from './schemas';

const { WALL_POSTS } = targets;

const formatPosts = ({ items: posts, profiles }) => (
  // omit anonymous posts without author id or with group id (negative)
  // it is not possible to get sex of author of anonymous posts too
  posts.filter((post) => {
    const authorId = post.signer_id || post.from_id;
    // return authorId > 0 && profiles.some(p => p.id === authorId);
    return authorId && authorId > 0;
  })
    .map((post) => {
      const authorId = post.signer_id || post.from_id;
      // profile: {
      //   first_name, last_name, screen_name, online,
      //   online_mobile, deactivated: 'deleted' || 'banned',
      // }
      const profile = profiles.find(p => p.id === authorId); // TODO: || {} ???
      if (!profile) {
        console.log('NO PROFILE AUTHOR ID: ', authorId);
      }
      const { first_name: first = '', last_name: last = '' } = profile;
      const authorName = `${first} ${last}`;

      return {
        authorId,
        authorName: !first || !last ? authorName.trim() : authorName,
        authorGender: profile.sex,
        screenName: profile.screen_name || null,
        online: profile.online, // 0 || 1    rename to isOnline later
        onlineMobile: profile.online_mobile,
        timestamp: post.date,
        id: post.id,
        text: post.text,
        link: `https://vk.com/wall${post.owner_id}_${post.id}`,
        photo50: profile.photo_50,
        photo100: profile.photo_100,
        comments: post.comments.count,
        likes: post.likes.count,
        deactivated: profile.deactivated || null,
      };
    })
);

function extractPostsByAuthorId(posts, authorId) {
  return posts.filter(post => (
    post.from_id === authorId || post.signer_id === authorId
  ));
}

function extractPostsByGender(posts, authorGender) {
  return posts.filter(post => post.authorGender === authorGender);

  // return posts.filter((post) => {
  //   const authorId = post.signer_id || post.from_id;
  //
  //   // return authorId && authorId > 0 && profiles.some(profile => (
  //   return profiles.some(profile => (
  //     profile.id === authorId && profile.sex === authorGender
  //   ));
  // });
}

// const responseParsers = {
//   authorId: extractPostsByAuthorId,
//   gender: extractPostsByGender,
// };

export const normalizeShallowly = (items) => {
  const result = {
    itemsById: {},
    ids: [],
  };

  items.forEach((item) => {
    result.itemsById[item.id] = { ...item };
    result.ids.push(item.id);
  });
  return result;
};

const POST_AUTHOR_ID = 'Post-Author-Id';
const POST_AUTHOR_GENDER = 'Post-Author-Gender';

export const responseFilters = { POST_AUTHOR_ID, POST_AUTHOR_GENDER };

// TODO: change to more generic filterResponse ?

export const filterWallPosts = (posts, filters) => {
  const parsedPosts = Object.keys(filters).reduce((acc, filterName) => {
    const filterValue = filters[filterName];

    if (!filterValue) {
      return acc;
    }
    switch (filterName) {
      case 'postAuthorGender':
        return extractPostsByGender(acc, filterValue);
      case 'postAuthorId':
        return extractPostsByAuthorId(acc, filterValue);
      default:
        return acc;
    }
  }, posts);

  return parsedPosts;
};

const transformResponse = (response, target, filters) => {
  let processed;

  // TODO: try redux.compose
  // return compose(
  //   filterWallPosts,
  //   formatPosts,
  //   omitAnonymous
  // )(response, filters);

  switch (target) {
    case WALL_POSTS:

      // TODO: filte posts first

      processed = filterWallPosts(formatPosts(response), filters);
      break;
    default:
      processed = response;
  }
  const normalized = normalize(processed, schemas[target]);
  console.log('NORMALIZED ', normalized);
  // TEMP:
  return { itemsById: normalized.entities.posts, ids: normalized.result };
};

// const transformResponse = (target, authorId) => (response) => {
// const transformResponse = (response, target, filters) => {
//   switch (target) {
//     case 'wall-posts':
//       return transformWallPosts(response, filters);
//     default:
//       return response;
//   }
// };

export default transformResponse;

// function extractPostsFromResponse(response) {
//   let posts;
//   try {
//     ({ items: posts } = response);
//   } catch (e) {
//     throw Error('Unable to extract posts from response');
//   }
//
//   if (!Array.isArray(posts)) { // NOTE: is this check unnecessary ?
//     throw Error('Posts from response is not an array');
//   }
//   return posts;
// }

// const formatPosts = (posts, profiles) => (
//   posts.map((post) => {
//     const authorId = post.signer_id || post.from_id;
//     // profile: {
//     //   first_name, last_name, screen_name, online,
//     //   online_mobile, deactivated: 'deleted' || 'banned',
//     // }
//     const profile = profiles.find(p => p.id === authorId);
//     const { first_name: first, last_name: last } = profile;
//     const authorName = `${first || ''} ${last || ''}`;
//
//     return {
//       authorId,
//       authorName: !first || !last ? authorName.trim() : authorName,
//       screenName: profile.screen_name,
//       online: profile.online, // 0 || 1    rename to isOnline later
//       onlineMobile: profile.online_mobile,
//       timestamp: post.date,
//       id: post.id,
//       text: post.text,
//       link: `https://vk.com/wall${post.owner_id}_${post.id}`,
//       photo50: profile.photo_50,
//       photo100: profile.photo_100,
//       comments: post.comments.count,
//       likes: post.likes.count,
//       deactivated: profile.deactivated,
//     };
//   })
// );
