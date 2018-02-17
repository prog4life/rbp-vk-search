import axiosJSONP from 'utils/axios-jsonp';
import prepareWallPosts from 'utils/response-handling';

export const CALL_API = 'Call API';

export const kindsOfRequest = {
  wallPosts: 'WALL_POSTS'
  // wallComments: 'WALL_COMMENTS'
};

export default ({ getState, dispatch }) => next => (action) => {
  const middlewareKey = action[CALL_API];
  const { kindOfRequest } = action;
  const { types, url, attempt, authorId, searchResultsLimit } = action;

  if (middlewareKey !== 'Call API') {
    return next(action);
  }

  if (Array.isArray(types) && types.length !== 3) {
    throw new Error('Expected an array of three action types');
  }
  if (!kindOfRequest) {
    throw new Error('Specify one of the exported kinds of requests');
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected action types to be strings');
  }

  // if (typeof endpoint === 'function') {                                       !!!
  //   endpoint = endpoint(store.getState())
  // }

  const [ requestType, successType, failureType ] = types;

  next({ type: requestType, attempt });

  axiosJSONP(url)
    .then(
      response => (
        getState().search.isActive
          ? response
          : Promise.reject(new Error(`Respone for ${url} became unnecessary, as
              search is terminated already`))
      ),
      error => (
        getState().search.isActive
          ? dispatch({ type })
          : Promise.reject(new Error(`Respone for ${url} became unnecessary, as
              search is terminated already`))
      )
    )
    .then(prepareWallPosts(authorId))
    .then()
};
