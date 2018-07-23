const configureStoreProd = require('./configureStore.prod');
const configureStoreDev = require('./configureStore.dev');

if (process.env.NODE_ENV === 'production') {
  module.exports = configureStoreProd;
} else {
  module.exports = configureStoreDev;
}
