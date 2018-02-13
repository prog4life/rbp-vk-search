const sortByTimestamp = (posts, order) => (
  posts.sort((a, b) => (
    order === 'asc'
      ? a.timestamp - b.timestamp
      : b.timestamp - a.timestamp
  ))
);

const addOnlyUniquePosts = (state, posts) => (
  posts.reduce((accum, post) => (
    accum.some(prev => prev.postId === post.postId)
      ? accum
      : accum.concat({ ...post })
  ), [...state])
);

// const addNewResults = (state, action) => (
//   [
//     ...state,
//     ...action.results.map(res => ({ ...res }))
//   ]
// );

export default function results(state = [], action) {
  switch (action.type) {
    // TODO: prevent adding of same results
    case 'ADD_RESULTS':
      return sortByTimestamp(
        addOnlyUniquePosts(state, action.results),
        action.order
      ).slice(0, action.limit);
    // to clear results at search start
    // case 'PREPARE_SEARCH':
    //   return [];
    case 'WALL_POSTS_SEARCH_START':
      return [];
    default:
      return state;
  }
}

// const duplicatedRemoved = [
//   ...state,
//   results.filter(result => !state.some(prev => prev.postId === result.postId))
//     .map(filtered => ({ ...filtered }))
// ];
