import { delay } from 'redux-saga'
import { takeEvery } from 'redux-saga/effects';
// import fetchJSONP from 'utils/fetchJSONP';

function* fetchWallPosts(data) {
  console.log('worker fetchWallPosts saga started with: ', data);
  // yield fetchJSONP(data.endpoint);
  yield delay(3000);
  console.log('worker fetchWallPosts saga after delay');
}

function* watchSearchCallAPI() {
  yield takeEvery('SEARCH::Call-API', fetchWallPosts);
}

export default watchSearchCallAPI;
