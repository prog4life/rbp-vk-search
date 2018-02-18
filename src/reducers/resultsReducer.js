// const sortByTimestamp = (posts, order) => (
//   posts.sort((a, b) => (
//     order === 'asc'
//       ? a.timestamp - b.timestamp
//       : b.timestamp - a.timestamp
//   ))
// );

// TODO: sort in selector
const sortItemsByNumField = (items, sortBy, order = 'desc') => {
  if (!Array.isArray(items)) {
    throw Error('Expected sorted items to be an array');
  }
  if (typeof sortBy !== 'string') {
    throw Error('Expected sortBy to be a string');
  }
  if (order !== 'desc' && order !== 'asc') {
    throw Error('Expected order to be a string "desc" or "asc"');
  }

  // if (prev.length === items.length ||
  //     prev.every((one, index) => one === items[index])) {
  //   return prev;
  // }

  return items.sort((a, b) => (
    order === 'asc'
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy]
  ));
};

const addOnlyUniqueItems = (state, items, compareBy) => (
  items.reduce((accum, item) => (
    accum.some(prev => prev[compareBy] === item[compareBy])
      ? accum
      : accum.concat({ ...item })
  ), [...state])
);

// TODO: refactor to storing results as hashmap-like object
export default function results(state = [], action) {
  switch (action.type) {
    case 'ADD_RESULTS':
      return sortItemsByNumField(
        addOnlyUniqueItems(state, action.results, 'postId'),
        'timestamp',
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
