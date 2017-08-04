import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import main from './styles/main.css';

const RESULTS = [
  {
    content: 'some found content',
    link: 'https://vk.com/wall-4242/post-5252'
  },
  {
    content: 'yet another found content',
    link: 'https://vk.com/wall-4242/post-7081'
  }
];

ReactDOM.render(<App results={RESULTS}/>, document.getElementById('root'));
