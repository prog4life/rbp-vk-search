import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects';
// import fetchJSONP from 'utils/fetchJSONP';
import jsonpPromise from 'utils/jsonpPromise';

function* fetchWallPosts(data) {
  yield put({ type: 'fetchWallPosts SAGA started', data });
  const result = yield jsonpPromise(data.endpoint).then(
    response => put({ type: 'fetchWallPosts SAGA fullfiled', response }),
    e => put({ type: 'fetchWallPosts SAGA rejected', message: e.message }),
  );
  yield result;
}

function* watchSearchCallAPI() {
  yield takeEvery('SEARCH::Call-API', fetchWallPosts);
}

export default function* mainSaga() {
  yield all([
    watchSearchCallAPI(),
  ]);
}
