export function extractPostsByAuthorId(response, authorId) {
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
    fromId: post.signer_id || post.from_id,
    timestamp: post.date,
    postId: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`
  }))
);

// TODO: add order to common config
// TODO: maybe need to sort in reducer
export const sortPosts = (posts, desc = true) => (
  posts && posts.sort((a, b) => (
    desc
      ? b.timestamp - a.timestamp
      : a.timestamp - b.timestamp
  ))
);

const parsePostsFromWall = authorId => (response) => {
  const extractedPosts = extractPostsByAuthorId(response, authorId);
  const formatedPosts = formatWallPosts(extractedPosts);

  return sortPosts(formatedPosts, true);
};

export default parsePostsFromWall;

