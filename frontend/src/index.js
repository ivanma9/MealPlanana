import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { checkLoggedIn } from './util/session';
import configureStore from './store/store';

const renderApp = (preloadedState) => {
  const store = configureStore(preloadedState);

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
  );

  // FOR TESTING, remove before production
  window.getState = store.getState;
  console.log(store.getState());
};

(async () => renderApp(await checkLoggedIn()))();
