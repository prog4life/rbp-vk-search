const clientID = 5931563;
const display = 'popup';
// const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const redirectURI = 'http://localhost:7031';
const scope = 'friends'; // 'wall,friends,groups';
const responseType = 'token';
const apiVersion = 5.71; // 5.68
// amount of requested items (wall posts, comments), vk API max limit: 100
// is equal to "offset" modifier/step
const count = 100;
// 0 OR 1 - specify to return or not additional "groups" and "profiles" fields
const extended = 0;
const state = 55555; // optional
// vk API limit is 3 requests per second
const requestInterval = 350;
// search reuests are not sequential/serial (API data can be processed NOT in
// strong order), if some requests have failed or were longer than interval,
// older data сan be received first and newer data will be received later,
// after repeated requests
// with jsonpTimeout lower than 1000 ms search may collapse !!!
const jsonpTimeout = 1000; // default for fetch-jsonp: 5000
// make or not next requests if previous one have not completed yet
const waitPending = true;
const waitTimeout = 3000;

const resultsSortOrder = 'desc';

const inputDefaults = {
  searchResultsLimitDef: 10,
  ownerIdDef: '75465366',
  ownerDomainDef: '',
  postAuthorIdDef: 372045306
};

const tokenRequestBaseURL =
  `https://oauth.vk.com/authorize?client_id=${clientID}&` +
  `display=${display}&scope=${scope}&response_type=${responseType}&` +
  `v=${apiVersion}&state=${state}&redirect_uri=${redirectURI}`;

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
  requestInterval,
  jsonpTimeout,
  waitPending,
  waitTimeout,
  resultsSortOrder,
  inputDefaults,
  tokenRequestBaseURL,
  tokenRequestURL
};
