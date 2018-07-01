import { LIKES_IS_LIKED_BASE_URL } from 'constants/api';
import { apiVersion, requestInterval } from 'config/common';
import { targets, SEARCH_BY_ITEMS } from 'middleware/searchByItems';

// eslint-disable-next-line import/prefer-default-export
export const searchForLikesToPosts = ({
  posts, likerId, wallOwnerId = '-58303640', objectType = 'post',
}) => ({
  types: ['RECEIVE_LIKES'],
  getNumberOfResults: state => 1,
  [SEARCH_BY_ITEMS]: {
    baseRequestURL: 'https://api.vk.com/method/likes.isLiked?',
    items: posts,
    likerId,
    objectType,
    ownerId: wallOwnerId,
    // mode: postAuthorId ? WALL_POSTS_BY_AUTHOR_ID : WALL_POSTS_BY_SEX,
    // target: targets.LIKES_TO_POSTS,
    // filters: { postAuthorId, postAuthorSex },
    resultsLimit: null,
    apiVersion: 5.80,
  },
  meta: {
    // next 2 is optional
    requestInterval,
    maxAttempts: 5,
  },
});
