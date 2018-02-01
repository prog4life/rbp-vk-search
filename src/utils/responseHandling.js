// TODO: replace all next functions to utils ?
export function extractPostsByAuthorId(response, authorId) {
  let posts;
  try {
    ({ items: posts } = response);
  } catch (e) {
    console.error('Unable to extract posts from response ', e);
    return false;
  }

  if (Array.isArray(posts)) {
    return posts.filter(post => post.from_id === authorId);
  }
  console.error('Items in response is not an array');
  return false;
}

export const formatWallPosts = posts => (
  posts && posts.map(post => ({
    fromId: post.from_id,
    timestamp: post.date,
    postId: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`
  }))
);

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

