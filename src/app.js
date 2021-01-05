import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import LoadingPage from './components/LoadingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

// ReactDOM.render(<LoadingPage />, document.getElementById('app'));

ReactDOM.render(jsx, document.getElementById('app'));



