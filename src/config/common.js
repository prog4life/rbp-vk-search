const clientID = 5931563;
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
// make or not request with next offset if current one get no response yet
const waitPending = true;
const waitTimeout = 1000;
// with maxAttemptsPending > 0, request that exceeded "waitTimeout" will be
// repeated but not canceled - if it get response, duplicate results can be
// obtained. These extra results are currently filtered by results reducer
const maxAttemptsPending = 1;
const maxAttemptsFailed = 2;

const resultsSortOrder = 'asc'; // OR 'desc'

// TEMP:
const inputDefaults = {
  searchResultsLimitDef: 10,
  ownerIdDef: '75465366',
  ownerDomainDef: '',
  postAuthorIdDef: 372045306
};

const tokenRequestURL =
  `https://oauth.vk.com/authorize?client_id=${clientID}&` +
  `display=${display}&redirect_uri=${redirectURI}&` +
  `scope=${scope}&response_type=${responseType}&` +
  `v=${apiVersion}&state=${state}`;

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
  waitPending,
  waitTimeout,
  maxAttemptsPending,
  maxAttemptsFailed,
  resultsSortOrder,
  inputDefaults,
  tokenRequestURL
};
