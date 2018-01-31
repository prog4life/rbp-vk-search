// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
// import {AppContainer} from 'react-hot-loader';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap-theme.min.css';

import App from 'containers/App';

import 'styles/main.css';

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

ReactDOM.render(<App />, document.getElementById('root'));

// NOTE: for react-hot-loader, HMR
// if (module.hot) {
//   module.hot.accept('./components/App', () => {
//     const App = require('./components/App').default;
//
//     ReactDOM.render(
//       <AppContainer>
//         <Provider store={configureStore()}>
//           <App />
//         </Provider>
//       </AppContainer>,
//       document.getElementById('root')
//     );
//   });
// }
