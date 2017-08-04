const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || '7031';
const hostname = process.env.IP || 'localhost';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.set('Content-Type', 'image/x-icon');
  res.status(200).end();
});

app.set('port', port);

app.listen(port, hostname, () => {
  console.log(`Server is listening at ${app.get('port')} port`);
});
