import 'whatwg-fetch';
import 'babel-polyfill';

if (typeof Promise === 'undefined' || typeof Object.values !== 'function') {
  // require('promise/lib/rejection-tracking').enable();
  // require('babel-polyfill'); // eslint-disable-line
}

// import 'airbnb-js-shims/target/es2015';
// import 'airbnb-browser-shims/browser-only';
