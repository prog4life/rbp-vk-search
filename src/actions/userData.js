import jsonp from 'utils/jsonpPromise';
import { getAccessToken } from 'selectors';

export const fetchUserDataRequest = () => ({ type: 'FETCH_USER_DATA_REQUEST' });
export const fetchUserDataSuccess = userData => ({
  type: 'FETCH_USER_DATA_SUCCESS',
  userData,
});
export const fetchUserDataFail = () => ({ type: 'FETCH_USER_DATA_FAIL' });

export const fetchUserData = enteredValues => async (dispatch, getState) => {
  const accessToken = getAccessToken(getState());
  console.log('at ', accessToken);
  const { userId, fields: { any } = {} } = enteredValues;
  // NOTE: can get next HIDDEN data: 'last_seen'
  const fields = [
    'city', 'sex', 'bdate', 'country', 'home_town', 'followers_count',
    'relatives', 'relation', 'last_seen', 'contacts', 'has_photo',
    'can_write_private_message', 'can_send_friend_request', 'connections',
    'is_friend', 'blacklisted', 'personal', 'timezone',
  ];
  const url = 'https://api.vk.com/method/users.get?' // TODO: USERS_GET_BASE_URL
    + `&access_token=${accessToken}&v=5.80`
    + `&user_ids=${userId}&fields=${fields.join(',')}&name_case=nom`;

  dispatch(fetchUserDataRequest());

  return jsonp(url).then(
    // ([userData]) => dispatch(fetchUserDataSuccess(userData)),
    ([userData]) => console.log(userData),
    error => console.error(error),
  );
};
