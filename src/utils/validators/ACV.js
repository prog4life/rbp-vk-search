export default class ActionCreatorsValidator {
  constructor(actionCreatorName) {
    this.target = actionCreatorName;
    // this.isProd = this.nodeEnv === 'production';
  }

  validations = {
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
  }

  check(actionCreatorName, payload) {
    this.isProd = process.env.NODE_ENV === 'production';

    if (this.isProd) {
      return;
    }
    if (typeof actionCreatorName !== 'string') {
      throw new Error('actionCreatorName string values is required');
    }
    if (!payload || typeof payload !== 'object') {
      throw new Error('Expected object with validated values as only argument');
    }
    this.validations[this.target || actionCreatorName](payload);
  }
}

// const validateActionCreator = (actionCreatorName, payload) => {
//   const validator = new ActionCreatorsValidator(actionCreatorName);
//   validator.check(payload);
// };

// export default new ActionCreatorsValidator();
