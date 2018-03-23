export function extractPostsById(response, authorId) {
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
  throw Error('Posts from response is not array');
}

export const formatWallPosts = posts => (
  posts && posts.map(post => ({
    // TODO: resolve, must be signer_id in some cases; rename to postAuthor
    authorId: post.signer_id || post.from_id,
    timestamp: post.date,
    postId: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`,
  }))
);

export const transformToPostsById = (posts) => {
  const postsById = {};
  posts.forEach((one) => {
    postsById[one.postId] = one;
  });
  return postsById;
};

const prepareWallPosts = authorId => (response) => {
  const formatted = formatWallPosts(extractPostsById(response, authorId));
  return transformToPostsById(formatted);
};

export default prepareWallPosts;

