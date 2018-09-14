import _ from 'lodash';
import { httpGetAnimals } from './animals/fetch.js';

export const fetchAnimalsContext = (...args) => httpGetAnimals(...args);
export const fetchAnimalsRedux = (filter = 'all') => (reduxDispatch) => {
  const dispatch = (extras) => reduxDispatch(_.merge({
    type: 'animals', status: null, index: filter, data: undefined, error: undefined
  }, extras));

  dispatch({ status: 'started' });
  return httpGetAnimals(filter).then(
    (data) => dispatch({ status: 'success', data }),
    (error) => dispatch({ status: 'failure', error })
  );
};
