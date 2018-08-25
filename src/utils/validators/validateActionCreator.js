const validations = {
  startWallPostsSearch(inputData) {
    const {
      wallOwnerUsualId, wallOwnerCustomId, postAuthorId, postAuthorSex,
    } = inputData;

    if (!wallOwnerUsualId && !wallOwnerCustomId) {
      throw new Error('At least one of wallOwnerUsualId or wallOwnerCustomId is required');
    }
    if (!postAuthorId && !postAuthorSex) {
      throw new Error('At least one of postAuthorId or postAuthorSex is required');
    }
  },
  setPostsSortOrder({ order }) {
    if (order !== 'descend' && order !== 'ascend') {
      throw new Error('Expected order to be "descend" or "ascend"');
    }
  },
};

export default function validateActionCreator(actionCreatorName, payload) {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    return;
  }
  if (typeof actionCreatorName !== 'string') {
    throw new Error('actionCreatorName string values is required');
  }
  if (!payload || typeof payload !== 'object') {
    throw new Error('Expected object with validated values as only argument');
  }
  validations[actionCreatorName](payload);
}
