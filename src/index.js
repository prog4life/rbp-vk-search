import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
// import {AppContainer} from 'react-hot-loader';
import App from 'App';
import configureStore from 'store/configureStore';

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import main from './styles/main.css';

const RESULTS = [
  {
    postId: 37844,
    fromId: 413870329,
    text: 'Мне 29 лет симпатичная девушка. Ищу партнёра для интим отношений ' +
    'только постоянного, за материальную поддержку',
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

ReactDOM.render(
  <Provider store={configureStore()}>
    <App results={RESULTS} />
  </Provider>,
  document.getElementById('root')
);

// for react-hot-loader
// if (module.hot) {
//   module.hot.accept('./components/App', () => {
//     const App = require('./components/App').default;
//
//     ReactDOM.render(
//       <AppContainer>
//         <Provider store={configureStore()}>
//           <App results={RESULTS} />
//         </Provider>
//       </AppContainer>,
//       document.getElementById('root')
//     );
//   });
// }
