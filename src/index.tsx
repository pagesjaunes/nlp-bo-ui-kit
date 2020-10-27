import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './example/App';
import './style/index.css';
import registerServiceWorker from './example/registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
