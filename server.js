const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const config = require('./webpack.config');

const port = process.env.PORT || '7031';
// const hostname = process.env.IP || 'localhost';

// const compiler = webpack(config);
// app.use(webpackHotMiddleware(compiler));
// app.use(webpackDevMiddleware(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
//   stats: {
//     colors: true
//   }
// }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/x-icon');
  res.status(200).end();
});

app.set('port', port);

app.listen(port, () => {
  console.log(`Server is up at http://localhost:${app.get('port')}`);
})
.on('error', (error) => {
  console.log(error);
});
