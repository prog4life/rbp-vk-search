import { schema } from 'normalizr';

export const post = new schema.Entity('posts');
export const user = new schema.Entity('users');
export const arrayOfPosts = new schema.Array(post);
// shorthand of the same:
export const arrayOfUsers = [user];

const WALL_POSTS = 'wall-posts';

export const targets = {
  WALL_POSTS,
};

// schemas
export default {
  // [WALL_POSTS]: {
  //   items: [post],
  //   profiles: [user],
  // },
  [WALL_POSTS]: arrayOfPosts,
};
