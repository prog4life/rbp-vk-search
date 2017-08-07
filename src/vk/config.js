export default {
  clientID: 5931563,
  display: 'popup',
  redirectURI: 'https://main-dev2get.c9users.io',
  // redirectURI: 'https://nameless-sea-73563.herokuapp.com',
  scope: 'friends',
  responseType: 'token',
  apiVersion: 5.62,
  state: 55555,
  accessToken: '',
  tokenExpiresAt: null,
  // TODO: choose one
  // serverTokenURL: 'https://main-dev2get.c9users.io/auth',
  // serverTokenURL: 'https://nameless-sea-73563.herokuapp.com/auth',
  // individual user id (vk user id)
  userID: null,
  get tokenRequestURL() {
    return `https://oauth.vk.com/authorize?client_id=${this.clientID}&` +
      `display=${this.display}&redirect_uri=${this.redirectURI}&` +
      `scope=${this.scope}&response_type=${this.responseType}&` +
      `v=${this.apiVersion}&state=${this.state}`;
  }
};
