import _ from 'lodash';
import { combineReducers } from 'redux';

const localReducer = (localState = {}, action = {}) => _.merge(
  { data: undefined, error: undefined, cached: undefined, loading: undefined, status: undefined },
  localState,
  _.pick(action, ['data', 'error', 'status']),
  (action.status === 'started') && { loading: true },
  (action.status !== 'started') && { loading: false },
  (action.status === 'success') && { cached: true }
);

export const indexedReducerFor = (type) => (state = {}, action = {}) => (
  (action.type !== type) ? (state || {}) : _.merge(
    {}, state, { [action.index]: localReducer(_.get(state, action.index, {}), action) }
  )
);

export const root = combineReducers({
  animals: indexedReducerFor('animals')
});

export default root;
