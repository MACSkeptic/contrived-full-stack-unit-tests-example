import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers.js';

const loggerMiddleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

export const configureStore = (preloadedState) => {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if ((process.env.NODE_ENV !== 'production') && module.hot) {
    module.hot.accept('./reducers.js', () => store.replaceReducer(rootReducer));
  }

  return store;
};
export default configureStore;
