// export default {
//   clientID: 5931563,
//   display: 'popup',
//   // redirectURI: 'https://main-dev2get.c9users.io',
//   redirectURI: 'https://nameless-sea-73563.herokuapp.com',
//   scope: 'friends',
//   responseType: 'token',
//   apiVersion: 5.67,
//   state: 55555,
//   // TODO: choose one
//   // serverTokenURL: 'https://main-dev2get.c9users.io/auth',
//   // serverTokenURL: 'https://nameless-sea-73563.herokuapp.com/auth',
//   get tokenRequestURL() {
//     return `https://oauth.vk.com/authorize?client_id=${this.clientID}&` +
//       `display=${this.display}&redirect_uri=${this.redirectURI}&` +
//       `scope=${this.scope}&response_type=${this.responseType}&` +
//       `v=${this.apiVersion}&state=${this.state}`;
//   }
// };

const clientID = 5931563;
const display = 'popup';
// const redirectURI = 'https://main-dev2get.c9users.io';
const redirectURI = 'https://nameless-sea-73563.herokuapp.com';
const scope = 'friends';
const responseType = 'token';
const apiVersion = 5.67;
const state = 55555;
// TODO: choose one
// serverTokenURL: 'https://main-dev2get.c9users.io/auth',
// serverTokenURL: 'https://nameless-sea-73563.herokuapp.com/auth',
const tokenRequestURL =
  `https://oauth.vk.com/authorize?client_id=${clientID}&` +
  `display=${display}&redirect_uri=${redirectURI}&` +
  `scope=${scope}&response_type=${responseType}&` +
  `v=${apiVersion}&state=${state}`;

const vkConfig = {
  clientID,
  display,
  redirectURI,
  scope,
  responseType,
  apiVersion,
  state,
  tokenRequestURL
};

export default vkConfig;
