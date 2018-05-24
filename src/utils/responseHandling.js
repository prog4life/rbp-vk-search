import { compose } from 'redux';

function extractPostsById(response, authorId) {
  let posts;
  try {
    ({ items: posts } = response);
  } catch (e) {
    throw Error('Unable to extract posts from response');
  }

  if (Array.isArray(posts)) {
    return posts.filter(post => (
      post.from_id === authorId || post.signer_id === authorId
    ));
  }
  throw Error('Posts from response is not an array');
}

const formatPosts = posts => (
  posts.map(post => ({
    // TODO: resolve, must be signer_id in some cases; rename to postAuthor
    authorId: post.signer_id || post.from_id,
    timestamp: post.date,
    id: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`,
  }))
);

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

export const handleWallPosts = (response, authorId) => {
  const formatted = formatPosts(extractPostsById(response, authorId));
  return normalizeShallowly(formatted);
  // TODO: try redux.compose
  // return compose(
  //   normalizeShallowly,
  //   formatPosts,
  //   extractPostsById
  // )(response, authorId);
};

const transformResponse = (schema, authorId) => (response) => {
  switch (schema) {
    case 'wall-posts':
      return handleWallPosts(response, authorId);
    default:
      return response;
  }
};

export default transformResponse;
