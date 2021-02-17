import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers/root';

export const configureStore = preloadedState => {
    return createStore(
        reducer,
        preloadedState,
        applyMiddleware(thunk)
    );
}
