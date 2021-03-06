import { createError } from 'utils/errorHelpers';

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

// status:
// 'connected',
// 'not_authorized' - logged in but grants rejected,
// 'unknown' - not authenticated

function login(newSettings) {
  return new Promise((resolve, reject) => {
    VK.Auth.login((response) => {
      const { session, status } = response;

      if (session && status === 'connected') {
        /* settings - Выбранные настройки доступа пользователя,
        если они были запрошены */
        // response: { session, status } | { session, status, settings };
        resolve(response);
      } else {
        /* Пользователь нажал кнопку Отмена в окне авторизации */
        reject(createError({ message: 'Login failed', ...response }));
      }
    }, newSettings);
  });
}

function logout() {
  return new Promise((resolve, reject) => {
    VK.Auth.logout((response) => {
      const { session, status } = response;

      if (!session || status === 'unknown') {
        resolve(response);
      } else {
        reject(createError('Failed to logout'));
      }
    });
  });
}

function onLogout(handler, subscribe = true) {
  if (subscribe) {
    VK.Observer.subscribe('auth.logout', handler);
  } else {
    // call without handler to remove all subscribers to this event
    VK.Observer.unsubscribe('auth.logout', handler);
  }
}

const openAPI = {
  call: callAPI,
  login,
  logout,
  onLogout,
};

export default openAPI;
