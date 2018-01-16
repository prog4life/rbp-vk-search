const clientID = 5931563;
const display = 'popup';
// const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const redirectURI = 'http://localhost:7031';
const scope = 'friends';
const responseType = 'token';
const apiVersion = 5.68;
// amount of requested items (wall posts, comments), vk API max limit: 100
const count = 100;
// 0 OR 1 - specify to return or not additional "groups" and "profiles" fields
const extended = 0;
const state = 55555;
// vk API limit is 3 requests per minute
const requestInterval = 350;
// set jsonpTimeout lower than requestInterval to make search sequential/serial
// (API data will be processed in strong order), otherwise if some requests
// have failed or were longer than interval, older data сan be received first
// and newer data will be received later, after repeated requests
// but with jsonpTimeout lower than 500-1000 ms search may collapse !!!
const jsonpTimeout = 1000;
const inputDefaults = {
  postsAmountDef: 10,
  ownerIdDef: '75465366',
  ownerDomainDef: '', // '4erniyspisok'
  authorIdDef: 372045306
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
  inputDefaults,
  tokenRequestBaseURL,
  tokenRequestURL
};
