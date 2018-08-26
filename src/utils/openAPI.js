import { compose } from 'redux';
import { changeMssg, createError } from 'utils/errorHelpers';

function callAPI(method, params) {
  return new Promise((resolve, reject) => {
    VK.Api.call(method, params, ({ response, error }) => {
      if (error) {
        reject(createError(error));
        return;
      }
      if (response) {
        resolve(response);
        return;
      }
      const reason = new Error(`API call failed, method: ${method},
        params: ${JSON.stringify(params)}`);
      reject(reason);
      // compose()(method, params); // TODO:
    });
  });
}

function login(/* newSettings */) {
  return new Promise((resolve, reject) => {
    VK.Auth.login((response) => {
      // status: 'connected', 'not_authorized' - logged in but grants rejected,
      // 'unknown' - not authenticated
      const { session, status, settings, error } = response;

      if (error) {
        reject(createError(error));
        return;
      }

      if (session) {
        if (settings) {
          /* Выбранные настройки доступа пользователя, если они были запрошены */
          // resolve({ session, status, settings });
          resolve(response);
          return;
        }
        // resolve({ session, status });
        resolve(response);
      } else {
        /* Пользователь нажал кнопку Отмена в окне авторизации */
        // resolve({ status });
        resolve(response); // TODO: reject
      }
    } /* , newSettings: Integer */);
  });
}

const openAPI = {
  call: callAPI,
  login,
};

export default openAPI;
