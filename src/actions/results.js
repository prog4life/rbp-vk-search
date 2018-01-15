export function extractUserPosts(response, authorId) {
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
  console.warn('Items in response is not an array');
  return false;
}

export const formatWallPosts = posts => (
  // TODO: add wallOwnerId as prop
  posts && posts.map(post => ({
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

export const parseWallPosts = (response, authorId, postsAmount) => (
  (dispatch) => {
    const userPosts = formatWallPosts(extractUserPosts(response, authorId));

    if (userPosts.length > 0) {
      // dispatch(addResults(results));
      dispatch({
        type: 'ADD_SORT_CUT_RESULTS',
        results: userPosts,
        ascending: false,
        amount: postsAmount
      });
      dispatch({ type: 'RESULTS_HAVE_BEEN_HANDLED' });
      // console.log('duration: ', Date.now() - searchStart);
      console.log('results chunk: ', userPosts);
    }
    return userPosts;
  }
);
