import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routers/AppRouter'

const jsx = (
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

ReactDOM.render(
  jsx,
  document.getElementById('root')
);