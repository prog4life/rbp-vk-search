import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_CANCEL,
  LOGOUT,
} from 'constants/actionTypes';

const defaultState = {
  accessToken: null,
  isAuthenticating: false,
  isLoggedIn: false,
  tokenExpiresAt: null,
  // userId: '',
  userName: '',
  userPageHref: '',
};

const authReducer = (state = defaultState, action) => {
  const { type, session } = action; // session can be null
  const { user } = session || {};

  switch (type) {
    case LOGIN:
      return { ...state, isAuthenticating: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isAuthenticating: false,
        userName: `${user.first_name || ''} ${user.last_name || ''}`, // TEMP:
        userPageHref: user.href,
      };
    case LOGIN_FAIL:
      return { ...state, isLoggedIn: false, isAuthenticating: false };
    case LOGIN_CANCEL:
      return { ...state, isLoggedIn: false, isAuthenticating: false };
    case LOGOUT: // is returning of defaultState correct?
      return { ...state, isLoggedIn: false, userName: '', userPageHref: '' };
    // case SIGN_OUT: // is returning of defaultState correct?
    //   return defaultState;
    default:
      return state;
  }
};

export default authReducer;

// export const getUserId = state => state.userId;
export const getUserName = state => state.userName;
export const getUserPageHref = state => state.userPageHref;
export const isLoggedIn = state => state.isLoggedIn;
