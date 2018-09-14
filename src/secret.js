import { render } from 'react-testing-library';
import App from './App';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './redux/store.js';
const renderUsingContext = () => (
  render((
    <MemoryRouter initialEntries={['/context/animals/all']}>
      <App />
    </MemoryRouter>
  ))
);
const renderUsingRedux = () => (
  render((
    <Provider store={configureStore()}>
      <MemoryRouter initialEntries={['/redux/animals/all']}>
        <App />
      </MemoryRouter>
    </Provider>
  ))
);

export const tests = (fn) => ([
  ['redux', renderUsingRedux],
  ['context', renderUsingContext]
].forEach(([framework, subject]) => {
  describe(`tests using ${framework}`, fn(subject));
}));

export default tests;
