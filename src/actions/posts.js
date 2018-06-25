import { SET_POSTS_SORT_ORDER, SET_POSTS_FILTER_TEXT } from 'constants/actionTypes';

export const setPostsSortOrder = (order = 'descend') => {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv !== 'production' && order !== 'descend' && order !== 'ascend') {
    throw new Error('Expected order to be "descend" or "ascend"');
  }
  return {
    type: SET_POSTS_SORT_ORDER,
    order,
  };
};

export const setPostsFilterText = (filterText = '') => ({
  type: SET_POSTS_FILTER_TEXT,
  filterText,
});
