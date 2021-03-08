import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

import thunk from 'redux-thunk';
import reducer from '../reducers/root';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['session'],
};

const persistedReducer = persistReducer(persistConfig, reducer);
const middleware = applyMiddleware(
  thunk,
  // logger, //* uncomment if you want to see the logs of what redux is doing
);

export default (preloadedState) => {
  const store = createStore(
    persistedReducer,
    preloadedState,
    middleware,
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
