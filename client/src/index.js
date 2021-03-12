import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/lib/integration/react';
import App from './components/App';
import { checkLoggedIn } from './util/session';
import configureStore from './store/store';

const renderApp = (preloadedState) => {
  const { store, persistor } = configureStore(preloadedState);

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={<h1>loading...</h1>} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>,
    document.getElementById('root'),
  );

  // FOR TESTING, remove before production
  window.getState = store.getState;
};

(async () => renderApp(await checkLoggedIn()))();
