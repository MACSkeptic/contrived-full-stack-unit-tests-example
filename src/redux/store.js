import _ from 'lodash';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers.js';

/* eslint-disable no-console */
const consoleFn = (fn) => (...args) => ((!process.env.TEST) && console[fn](...args));
/* eslint-enable no-console */
const info = consoleFn('info');
const group = consoleFn('group');
const log = consoleFn('log');
const groupEnd = consoleFn('groupEnd');

const loggerMiddleware = store => next => action => {
  group(action.type);
  info('dispatching', action);
  return _.tap(next(action), (result) => ([log('next state', store.getState()), groupEnd()]));
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
