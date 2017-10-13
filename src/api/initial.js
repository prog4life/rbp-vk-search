const clientID = 5931563;
const display = 'popup';
// const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const redirectURI = 'http://localhost:7031';
const scope = 'friends';
const responseType = 'token';
const apiVersion = 5.68;
const state = 55555;
// serverTokenURL: 'https://nameless-sea-73563.herokuapp.com/auth',
const tokenRequestURL =
  `https://oauth.vk.com/authorize?client_id=${clientID}&` +
  `display=${display}&redirect_uri=${redirectURI}&` +
  `scope=${scope}&response_type=${responseType}&` +
  `v=${apiVersion}&state=${state}`;

const init = {
  clientID,
  display,
  redirectURI,
  scope,
  responseType,
  apiVersion,
  state,
  tokenRequestURL
};

export default init;