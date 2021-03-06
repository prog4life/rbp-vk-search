const clientID = 5931563; // same as app_id or api_id
const display = 'popup';
// const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const redirectURI = 'http://localhost:7031';
const scope = 'friends'; // 'wall,friends,groups';
const responseType = 'token';
const apiVersion = 5.71; // 5.68
// amount of returned items (e.g. wall posts) per request, vk API max limit: 100
const count = 100; // better to leave equal to 100
const offsetModifier = count;
// 0 OR 1 - specify to return or not additional "groups" and "profiles" fields
const extended = 0;
const state = 55555; // optional
// vk API request frequency limit is 3 requests per second
const requestInterval = 350;
// better to leave default
const jsonpTimeout = 1000; // default for fetch-jsonp: 5000
// failed request will be repeated but not canceled - if it then
// receives a response, duplicate results can be obtained. These extra results
// must be filtered by reducer OR response handler
const maxAttempts = 5; // min: 1 - no retry attempts

const resultsSortOrder = 'asc'; // OR 'desc'

// TEMP:
const inputDefaults = {
  resultsLimitDef: 10,
  ownerIdDef: '75465366',
  ownerDomainDef: '',
  postAuthorIdDef: 372045306,
};

const tokenRequestURL = `https://oauth.vk.com/authorize?client_id=${clientID}&`
  + `display=${display}&redirect_uri=${redirectURI}&`
  + `scope=${scope}&response_type=${responseType}&`
  + `v=${apiVersion}&state=${state}`;

export {
  clientID,
  display,
  redirectURI,
  scope,
  responseType,
  apiVersion,
  count,
  extended,
  state,
  offsetModifier,
  requestInterval,
  jsonpTimeout,
  maxAttempts,
  resultsSortOrder,
  inputDefaults,
  tokenRequestURL,
};
