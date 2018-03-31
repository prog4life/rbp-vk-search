import axiosJSONP from 'utils/axiosJSONP';
import fetchJSONP from 'utils/fetchJSONP';
import jsonpPromise from 'utils/jsonpPromise';
import prepareWallPosts from 'utils/responseHandling';

export const CALL_API = 'Call API';

export const schema = {
  wallPosts: 'WALL_POSTS',
  // wallComments: 'WALL_COMMENTS'
};

const onRequestStart = (next, offset, attempt) => {
  const key = `offset_${offset}`;

  next({
    type: 'REQUEST_START',
    id: key,
    offset,
    startTime: Date.now(),
    attempt,
  });
};

const throwIfSearchIsOver = (isActive, offset) => {
  if (!isActive) {
    throw Error(`Needless request (offset: ${offset}), search is over already`);
  }
};

// such request obj was removed from store earlier
const throwIfRequestIsExcess = (request, offset) => {
  if (!request) {
    throw Error(`Request with ${offset} offset has been succeeded already`);
  }
};

// remove successful request obj from "requests"
const onRequestSuccess = (next, getState, offset) => (response) => {
  const { search, requests } = getState();
  const key = `offset_${offset}`;
  // console.log(`SUCCESS offset: ${offset}`);

  throwIfSearchIsOver(search.isActive, offset);
  throwIfRequestIsExcess(requests[key], offset);

  next({
    type: 'REQUEST_SUCCESS',
    id: key,
  });

  return response;
};

// add failed request obj with isPending: false to "requests"
const onRequestFail = (next, getState, offset) => (e) => {
  const { search, requests } = getState();
  const key = `offset_${offset}`;
  // console.log(`FAIL offset: ${offset}`);

  // TODO: think over case when belated failed but pending repeated exists

  throwIfSearchIsOver(search.isActive, offset);
  throwIfRequestIsExcess(requests[key], offset);

  next({
    type: 'REQUEST_FAIL',
    id: key,
    offset,
    startTime: requests[key].startTime,
    attempt: requests[key].attempt,
  });

  throw Error(`Request with ${offset} offset failed, ${e.message}`);
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
    next({
      type,
      results,
      limit,
    });
  }
  return results;
};

export default ({ getState, dispatch }) => next => (action) => {
  const callParams = action[CALL_API];
  const { types } = action;

  if (typeof callParams === 'undefined') {
    return next(action);
  }

  const {
    url, offset, attempt, authorId, resultsLimit,
  } = callParams;

  if (!Array.isArray(types) || types.length !== 2) {
    throw new Error('Expected an array of two action types');
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected action types to be strings');
  }
  if (typeof url !== 'string') {
    throw new Error('Specify a string request URL');
  }
  if (!Number.isInteger(offset) || !Number.isInteger(attempt)) {
    throw new Error('Expected offset and attempt to be integers');
  }
  if (!Number.isInteger(authorId)) {
    throw new Error('Expected authorId to be integer');
  }

  const [addResultsType, updateProgressType] = types;
  // add request obj with isPending: true to "requests"
  onRequestStart(next, offset, attempt);

  // TODO: is it necessary ?
  // const actionWith = (data) => {
  //   const finalAction = {
  //     ...action,
  //     ...data,
  //   };
  //   delete finalAction[CALL_API];
  //   return finalAction;
  // };

  return jsonpPromise(url)
    .then(
      onRequestSuccess(next, getState, offset),
      onRequestFail(next, getState, offset),
    )
    .then(onSearchProgress({
      next,
      getState,
      type: updateProgressType,
    }))
    // TODO: change to more generic then(transformResponse(schema))
    .then(prepareWallPosts(authorId))
    .then(savePartOfResults(next, resultsLimit, addResultsType))
    .catch(e => console.error(e));
};
