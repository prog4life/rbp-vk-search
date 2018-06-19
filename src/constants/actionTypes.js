// search middleware NOTE: maybe place next to middleware
export const SEARCH_SET_OFFSET = 'SEARCH::Set-Offset';
export const SEARCH_START = 'SEARCH::Start';
export const SEARCH_END = 'SEARCH::End';
export const TERMINATE_SEARCH = 'SEARCH::Terminate';

export const FETCH_WALL_POSTS_REQUEST = 'FETCH_WALL_POSTS_REQUEST';
export const FETCH_WALL_POSTS_FAIL = 'FETCH_WALL_POSTS_FAIL';

// posts
export const POSTS_RECEIVED = 'POSTS_RECEIVED';
export const CHANGE_POSTS_ORDER = 'CHANGE_POSTS_ORDER';

// requests
export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_REQUEST_SUCCESS = 'SEARCH_REQUEST_SUCCESS';
export const SEARCH_REQUEST_FAIL = 'SEARCH_REQUEST_FAIL';

// auth
export const SAVE_AUTH_DATA = 'SAVE_AUTH_DATA';
export const SET_USER_NAME = 'SET_USER_NAME';
export const FETCH_USER_NAME_FAIL = 'FETCH_USER_NAME_FAIL';
export const SIGN_OUT = 'SIGN_OUT';
export const NO_VALID_TOKEN = 'NO_VALID_TOKEN';
export const RECEIVE_TOKEN_ERROR = 'RECEIVE_TOKEN_ERROR';

// redirect
export const REDIRECT_TO_AUTH = 'REDIRECT_TO_AUTH';
export const REJECT_AUTH_REDIRECT = 'REJECT_AUTH_REDIRECT';
export const OFFER_AUTH_REDIRECT = 'OFFER_AUTH_REDIRECT';
