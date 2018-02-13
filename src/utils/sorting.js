import { resultsSortOrder as defaultOrder } from 'config/common';

export const sortItemsByTimestamp = (posts, order = defaultOrder) => (
  posts && posts.sort((a, b) => (
    order === 'asc'
      ? a.timestamp - b.timestamp
      : b.timestamp - a.timestamp
  ))
);

// usage: sortItemsByNumField(results, 'timestamp', 'desc');
export const sortItemsByNumField = (items, sortBy, order = defaultOrder) => {
  if (!Array.isArray(items)) {
    throw Error('Expected sorted items to be an array');
  }
  if (typeof sortBy !== 'string') {
    throw Error('Expected sortBy to be a string');
  }
  if (order && (order !== 'desc' || order !== 'asc')) {
    throw Error('Expected order to be a string "desc" or "asc"');
  }

  return items.sort((a, b) => (
    order === 'asc'
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy]
  ));
};
