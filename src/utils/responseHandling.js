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

export const formatWallPostResults = posts => (
  posts && posts.map(post => ({
    // TODO: resolve, must be signer_id in some cases; rename to postAuthor
    authorId: post.signer_id || post.from_id,
    timestamp: post.date,
    postId: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`,
  }))
);

const prepareWallPosts = authorId => response => (
  formatWallPostResults(extractPostsById(response, authorId))
);

export default prepareWallPosts;

