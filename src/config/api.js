const clientID = 5931563;
const display = 'popup';
// const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const redirectURI = 'http://localhost:7031';
const scope = 'friends';
const responseType = 'token';
const apiVersion = 5.68;
// amount of requested items (wall posts, comments), vk API max limit: 100
const count = 100;
const state = 55555;
const requestInterval = 350;
const jsonpTimeout = 500;
const inputDefaults = {
  postsAmountDef: 10,
  ownerIdDef: '75465366',
  // ownerDomainDef: '4erniyspisok',
  ownerDomainDef: '',
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
  state,
  requestInterval,
  jsonpTimeout,
  inputDefaults,
  tokenRequestBaseURL,
  tokenRequestURL
};
