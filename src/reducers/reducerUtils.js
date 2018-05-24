let isProduction = true;
try {
  isProduction = process.env.NODE_ENV === 'production';
} catch (e) {} // eslint-disable-line

export const addIfNotExist = (dest, addition) => {
  if (dest.includes(addition)) {
    return [].concat(dest);
  }
  return dest.concat(addition);
};

// make array with unique values from 2 arrays
// values from second array added to the end
export const makeUnion = (initial, additional) => (
  additional.reduce((acc, item) => (
    initial.includes(item) ? acc : acc.concat(item)
  ), [...initial])
);

export function createReducer(...args) {
  let initialState;
  let handlers;

  if (args.length > 1) {
    [initialState, handlers] = args;
  } else {
    [handlers] = args;
  }

  if (typeof handlers !== 'object') {
    throw new Error('Expected object as map of action types to handlers');
  }
  if (!isProduction && handlers['undefined']) { // eslint-disable-line dot-notation
    console.warn(`Reducer contains an 'undefined' action type.
      Have you misspelled a constant?`);
  }

  const newReducer = (state = initialState, action) => {
    if (handlers.hasOwnProperty(action.type)) { // eslint-disable-line
      return handlers[action.type](state, action);
    }
    return state;
  };
  return newReducer;
}
