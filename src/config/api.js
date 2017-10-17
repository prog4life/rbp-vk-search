const clientID = 5931563;
const display = 'popup';
// const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const redirectURI = 'http://localhost:7031';
const scope = 'friends';
const responseType = 'token';
const apiVersion = 5.68;
const state = 55555;
const requestInterval = 500;
const jsonpTimeout = 3000;
const inputDefaults = {
  postsAmountDef: 10,
  ownerIdDef: '',
  ownerDomainDef: '4erniyspisok',
  authorIdDef: 406853999,
  totalPostsDef: 3000
}
// serverTokenURL: 'https://nameless-sea-73563.herokuapp.com/auth',
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
  state,
  requestInterval,
  jsonpTimeout,
  inputDefaults,
  tokenRequestURL
};
