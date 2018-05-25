import {
  getAccessToken, getSearchTotal, getSearchOffset, getSearchIsActive,
  getRequestById, getIdsOfPending,
} from 'selectors';
// import fetchJSONP from 'utils/fetchJSONP';
import jsonpPromise from 'utils/jsonpPromise';
import transformResponse from 'utils/responseHandling';

export const API_CALL_PARAMS = 'CallAPI::Parameters';

export const schemas = {
  wallPosts: 'WALL_POSTS',
  // wallComments: 'WALL_COMMENTS'
};

const makeId = offset => `offset_${offset}`;

// const onRequestStart = (next, offset, type) => {
//   const id = makeId(offset);
//
//   next({ type, id, offset, startTime: Date.now() });
// };

const throwIfSearchIsOver = (isActive, offset) => {
  if (!isActive) {
    throw Error(`Needless request (offset: ${offset}), search is over already`);
  }
};

// if request obj was removed from store or added to completely failed
const throwIfRequestIsExcess = (request, id) => {
  if (!request) {
    throw new Error(`Request with id: "${id}" has been succeeded already`);
  }
};

// remove successful request obj from "requests"
const onRequestSuccess = (next, getState, offset, type) => (response) => {
  const state = getState();
  const id = makeId(offset);
  const isActive = getSearchIsActive(state);
  const requestById = getRequestById(state, id);

  throwIfSearchIsOver(isActive, offset);
  throwIfRequestIsExcess(requestById, id);

  next({ type, id });

  return response;
};

// add failed request obj to "requests"
const onRequestFail = (next, getState, offset, type) => (e) => {
  const state = getState();
  const id = makeId(offset);
  const isActive = getSearchIsActive(state);
  const pending = getIdsOfPending(state);

  // TODO: think over case when belated failed but pending repeated exists
  throwIfSearchIsOver(isActive, offset);
  // TODO: replace by specific memoized selector or check in reducer
  if (!pending.includes(id)) {
    throw new Error(`Offset "${offset}" has been processed already`);
  }

  next({ type, id }); // TODO: refused: true flag for processed offsets

  throw new Error(`Request with ${offset} offset failed, ${e.message}`);
};

const onSearchProgress = ({ next, getState, type }) => (response) => {
  const { total, processed } = getState().search;
  // to get updated "total"
  const nextTotal = response && response.count ? response.count : total;
  const itemsLength = response && response.items && response.items.length;

  let nextProcessed = processed;

  if (itemsLength) {
    nextProcessed += itemsLength;
  }

  if (nextTotal !== total || nextProcessed !== processed) {
    // console.info(`next processed ${nextProcessed} and total ${nextTotal}`);

    next({
      type,
      total: nextTotal,
      processed: nextProcessed,
    });
  }
  return response;
};

const savePartOfResults = (next, limit, type) => (results) => {
  // if (chunk && chunk.length > 0) {
  if (typeof results === 'object' && Object.keys(results).length > 0) {
    next({ type, results, limit });
  }
  return results;
};

export default ({ getState }) => next => (action) => {
  const callParams = action[API_CALL_PARAMS];
  const { types } = action;

  if (typeof callParams === 'undefined') {
    return next(action);
  }

  const { url, offset, authorId } = callParams;

  if (!Array.isArray(types) || types.length !== 4) {
    throw new Error('Expected an array of four action types');
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected action types to be strings');
  }
  if (typeof url !== 'string') {
    throw new Error('Specify a string request URL');
  }
  if (!Number.isInteger(offset)) {
    throw new Error('Expected offset to be integer number');
  }
  if (!Number.isInteger(authorId)) {
    throw new Error('Expected authorId to be integer');
  }

  const [requestType, successType, failType, resultsType] = types;
  // add request obj with isPending: true to "requests"
  // onRequestStart(next, offset, requestType);
  const id = makeId(offset);

  next({ type: requestType, id, offset, startTime: Date.now() });

  // TODO: is it necessary ?
  // const actionWith = (data) => {
  //   const finalAction = {
  //     ...action,
  //     ...data,
  //   };
  //   delete finalAction[SEARCH_REQUEST];
  //   return finalAction;
  // };

  // TODO: change id to offset -> requestsByOffset

  const onSuccess = (response) => {
    const state = getState();
    const id = makeId(offset);
    const isActive = getSearchIsActive(state);
    const requestById = getRequestById(state, id);

    throwIfSearchIsOver(isActive, offset);
    throwIfRequestIsExcess(requestById, id);
    next({
      type: successType,
      id,
      total: response.count || null,
      // NOTE: OR if can't get items length -> pass count (offsetModifier) ?
      amount: response.items ? response.items.length : null,
    });

    // return transformResponse('wall-posts', authorId)(response);

    // next({ type: resultsType, ...results });
    return response;
  };

  return jsonpPromise(url)
    .then(
      // onRequestSuccess(next, getState, offset, successType),
      onSuccess,
      onRequestFail(next, getState, offset, failType),
    )
    .then(response => transformResponse(response, 'wall-posts', authorId))
    .then(
      results => next({ type: resultsType, ...results }),
      error => console.warn(error), // TODO: try error.message and next()
    );
  // .then(onSearchProgress({
  //   next,
  //   getState,
  //   type: resultsType,
  // }));
  // TODO: change to more generic then(transformResponse(schema))
  // .then(transformResponse('wall-posts', authorId))
  // .then(savePartOfResults(next, resultsLimit, addResultsType))
  // .catch(e => console.warn(e));
};
