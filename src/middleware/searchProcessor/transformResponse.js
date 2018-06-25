import { compose } from 'redux';

function extractPostsFromResponse(response) {
  let posts;
  try {
    ({ items: posts } = response);
  } catch (e) {
    throw Error('Unable to extract posts from response');
  }

  if (!Array.isArray(posts)) { // NOTE: is this check unnecessary ?
    throw Error('Posts from response is not an array');
  }
  return posts;
}

function extractPostsByAuthorId(posts, authorId) {
  // const posts = extractPostsFromResponse(response);
  // const { items: posts } = response;

  return posts.filter(post => (
    post.from_id === authorId || post.signer_id === authorId
  ));
}

function extractPostsBySex(posts, profiles, sex) {
  // const posts = extractPostsFromResponse(response);
  // const { items: posts } = response;
  // const { profiles } = response;

  return posts.filter((post) => {
    const authorId = post.signer_id || post.from_id;

    return authorId && authorId > 0 && profiles.some(profile => (
      profile.id === authorId && profile.sex === sex
    ));
  });
}

// const responseParsers = {
//   authorId: extractPostsByAuthorId,
//   sex: extractPostsBySex,
// };

const formatPosts = (posts, profiles) => (
  posts.map((post) => {
    const authorId = post.signer_id || post.from_id;
    const profile = profiles.find(p => p.id === authorId);

    return {
      authorId,
      timestamp: post.date,
      id: post.id,
      text: post.text,
      link: `https://vk.com/wall${post.owner_id}_${post.id}`,
      photo50: profile.photo_50,
      photo100: profile.photo_100,
    };
  })
);

// TODO: use "normalize" pkg instead

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

export const transformWallPosts = (response, filters) => {
  // const formatted = formatPosts(extractPostsByAuthorId(response, authorId));
  // return normalizeShallowly(formatted);
  const posts = response.items;

  const parsedPosts = Object.keys(filters).reduce((acc, filterName) => {
    const filterValue = filters[filterName];

    if (!filterValue) {
      return acc;
    }
    switch (filterName) {
      case 'sex':
        return extractPostsBySex(acc, response.profiles, filterValue);
      case 'authorId':
        return extractPostsByAuthorId(acc, filterValue);
      default:
        return acc;
    }
  }, posts);

  return normalizeShallowly(formatPosts(parsedPosts, response.profiles));

  // TODO: try redux.compose
  // return compose(
  //   normalizeShallowly,
  //   formatPosts,
  //   extractPostsByAuthorId
  // )(response, authorId);
};

// const transformResponse = (schema, authorId) => (response) => {
const transformResponse = (response, schema, filters) => {
  switch (schema) {
    case 'wall-posts':
      return transformWallPosts(response, filters);
    default:
      return response;
  }
};

export default transformResponse;
