// for sync initialization, openapi.js script in head must be loaded in sync way
// VK.init({ // eslint-disable-line no-undef
//   apiId: 5931563, // TODO: inject from env var or common app config later
//   onlyWidgets: false,
// });

// for async initialization
// window.vkAsyncInit = () => {
//   VK.init({ // eslint-disable-line no-undef
//     apiId: 5931563, // TODO: inject from env var or common app config later
//     onlyWidgets: false,
//   });
//   console.log('VK.init was called');
// };

const initPromise = new Promise((resolve) => {
  window.vkAsyncInit = () => {
    VK.init({ // eslint-disable-line no-undef
      apiId: 5931563, // TODO: inject from env var or common app config later
      onlyWidgets: false,
    });
    console.log('VK.init was called');
    resolve();
  };
});

// at this moment next script is loaded at page <head> in async way
// setTimeout(() => {
//   const el = document.createElement('script');
//   el.type = 'text/javascript';
//   el.src = 'https://vk.com/js/api/openapi.js?159';
//   el.async = true;
//   document.getElementById('vk_api_transport').appendChild(el);
//   console.log('Append VK init script');
// }, 0);

export default initPromise;
