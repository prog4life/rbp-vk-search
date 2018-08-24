import {
  SAVE_AUTH_DATA,
  FETCH_USER_NAME_SUCCESS,
  SIGN_OUT,
} from 'constants/actionTypes';

const defaultState = {
  accessToken: null,
  tokenExpiresAt: null,
  userId: '',
  userName: '',
};

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_AUTH_DATA:
      return {
        ...state,
        accessToken: action.accessToken,
        tokenExpiresAt: action.tokenExpiresAt,
        userId: action.userId,
      };
    case FETCH_USER_NAME_SUCCESS:
      return {
        ...state,
        userName: action.userName,
      };
    case SIGN_OUT: // is returning of defaultState correct?
      return defaultState;
    default:
      return state;
  }
};

export default authReducer;

export const getUserId = state => state.userId;
export const getUserName = state => state.userName;
