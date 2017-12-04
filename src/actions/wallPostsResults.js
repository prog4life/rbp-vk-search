export function extractUserWallPosts(response, authorId) {
  const { items: posts } = response;

  if (Array.isArray(posts)) {
    return posts.filter(post => post.from_id === authorId);
  }
  throw new Error('Items in response is not an array');
}

export const formatWallPosts = posts => (
  // TODO: add wallOwnerId as prop
  posts.map(post => ({
    fromId: post.from_id,
    timestamp: post.date,
    postId: post.id,
    text: post.text,
    link: `https://vk.com/wall${post.owner_id}_${post.id}`
  }))
);

export const addResults = results => ({
  type: 'ADD_RESULTS',
  results
});

// TODO: replace sorting functionality into thunk
export const sortResults = ascending => ({
  type: 'SORT_RESULTS',
  ascending
});

export const cutExcessResults = amount => ({
  type: 'CUT_EXCESS_RESULTS',
  amount
});
