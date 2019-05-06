// for sync initialization, openapi.js script in head must be loaded in sync way
// VK.init({
//   apiId: 5931563, // TODO: inject it from env var or common app config
//   onlyWidgets: false,
// });

const initializeOpenAPI = () => new Promise((resolve) => {
  // NOTE: there was a bug with sript tag (with async attribute), that was added
  // to head, probably due to caching
  setTimeout(() => {
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://vk.com/js/api/openapi.js?159';
    el.async = true;
    // TEMP:
    el.onload = () => {
      console.log('::: Open API script "load" :::');
    };
    el.onloadstart = () => {
      console.log('::: Open API script "loadstart" :::');
    };
    // --- END ---
    document.getElementById('vk_api_transport').appendChild(el);
    console.log('::: Open API script is appended :::');
  }, 0);

  // for async initialization
  window.vkAsyncInit = () => {
    VK.init({
      apiId: 5931563, // TODO: inject it from env var or common app config
      onlyWidgets: false,
    });
    resolve();
  };
});

export default initializeOpenAPI;
