export const validateAction = (action, key) => {
  const {
    types, [key]: searchParams, getNumberOfResults,
  } = action;

  if (!Array.isArray(types) || types.length !== 1) {
    throw new Error('Expected an array of 1 action type(s)');
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected action types to be strings');
  }
  if (typeof searchParams !== 'object') {
    throw new Error('Expected an object with search config params');
  }
  if (typeof getNumberOfResults !== 'function') {
    throw new Error('Expected "getNumberOfResults" to be function');
  }
};

export const validateOffsetModifier = (offMod) => {
  if (!Number.isInteger(offMod) || offMod > 100 || offMod < 1) {
    throw new Error('Expected offsetModifier to be integer number > 0 and < 101');
  }
};

// NOTE: not used anymore as options will be not passed with action.meta further
export const validateOptions = (meta) => {
  const { offsetModifier, requestInterval, maxAttempts } = meta;

  validateOffsetModifier(offsetModifier);

  if (!Number.isInteger(requestInterval) || requestInterval < 350) {
    throw new Error(`Expected requestInterval to be integer number > 350
      (not more than 3 requests per second)`);
  }
  if (!Number.isInteger(maxAttempts) || maxAttempts < 3) {
    throw new Error(`Expected maxAttempts to be integer number > 2
      (not less than 2 repeated requests - 3 attempts overall)`);
  }
};

export const validateParams = (params) => {
  const { baseRequestURL, target, filters, resultsLimit } = params;

  if (typeof baseRequestURL !== 'string' || !baseRequestURL.length) {
    throw new Error('Expected baseRequestURL to be not empty string');
  }
  if (typeof target !== 'string' || !target.length) {
    throw new Error('Expected target to be not empty string');
  }
  if (typeof filters !== 'object') {
    throw new Error('Expected response filters to be object');
  }
  if (resultsLimit && (!Number.isInteger(resultsLimit) || resultsLimit < 1)) {
    throw new Error('Expected resultsLimit to be integer number that is > 0');
  }
  const { postAuthorId, postAuthorSex } = filters;

  if ((!Number.isInteger(postAuthorId) || postAuthorId < 1)
    && (postAuthorSex !== 1 && postAuthorSex !== 2)
  ) {
    throw new Error(`Expected either postAuthorId (as positive integer number)
      or postAuthorSex (as 1 or 2) to be provided`);
  }
};
