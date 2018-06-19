// eslint-disable-next-line import/prefer-default-export
export const changePostsOrder = (order = 'descend') => {
  if (order !== 'descend' && order !== 'ascend') {
    throw new Error('Expected order to be "descend" or "ascend"');
  }
  return {
    type: 'CHANGE_POSTS_ORDER',
    order,
  };
};
