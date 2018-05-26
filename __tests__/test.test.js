const { startWallPostsSearch } = require('actions/search');
const { POSTS_RECEIVED } = require('constants/actionTypes');

test('startWallPostsSearch should return action with types array of only' +
  ' "POSTS_RECEIVED" item', () => {
  const inputData = {
    wallOwnerType: 'any',
    wallOwnerId: 'any2',
  };
  expect(startWallPostsSearch(inputData).types[0]).toBe(POSTS_RECEIVED);
  expect(startWallPostsSearch(inputData).types).toEqual([POSTS_RECEIVED]);
});
