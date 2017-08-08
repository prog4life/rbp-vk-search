import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import main from './styles/main.css';

const RESULTS = [
  {
    postId: 37844,
    fromId: 413870329,
    text: 'Мне 29 лет симпатичная девушка. Ищу партнёра для интим отношений ' +
    'только постоянно, за материальную поддержку',
    link: 'https://vk.com/club75465366?w=wall-75465366_37844%2Fall'
  },
  {
    postId: 37824,
    fromId: 247772351,
    text: 'Я ищу спонсора на длительные отношения, я без опыта, полненькая ' +
    'но не сильно, общительная. Пишите в л/с',
    link: 'https://vk.com/club75465366?w=wall-75465366_37824%2Fall'
  }
];

ReactDOM.render(<App results={RESULTS}/>, document.getElementById('root'));
