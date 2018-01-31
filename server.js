const http = require('http');
const path = require('path');
const express = require('express');
// const remotedev = require('remotedev-server');
// require('remotedev-extension')({
//   port: 8000,
//   runserver: true
// });

const app = express();

// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const config = require('./webpack.config');

const port = process.env.PORT || '7031';
// const hostname = process.env.IP || 'localhost';

const publicPath = path.join(__dirname, 'public');

// const compiler = webpack(config);
// app.use(webpackHotMiddleware(compiler));
// app.use(webpackDevMiddleware(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
//   stats: {
//     colors: true
//   }
// }));

// remotedev({ hostname: 'localhost', port: 8000 }); // NOTE: not able to start

app.use(express.static(publicPath));

// TODO: remove after favicon will be added
app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/x-icon');
  res.status(200).end();
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.set('port', port);

app.listen(port, () => {
  console.log(`Server is up at http://localhost:${port}`);
});
