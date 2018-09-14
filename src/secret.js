import { render } from 'react-testing-library';
import App from './App';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ContextProvider } from './context.js';
import configureStore from './redux/store.js';
const renderUsingContext = () => (
  render((
    <ContextProvider>
      <MemoryRouter initialEntries={['/context/animals/all']}>
        <App />
      </MemoryRouter>
    </ContextProvider>
  ))
);
const renderUsingRedux = () => (
  render((
    <ReduxProvider store={configureStore()}>
      <MemoryRouter initialEntries={['/redux/animals/all']}>
        <App />
      </MemoryRouter>
    </ReduxProvider>
  ))
);

export const tests = (fn) => ([
  ['redux', renderUsingRedux],
  ['context', renderUsingContext]
].forEach(([framework, subject]) => {
  describe(`tests using ${framework}`, fn(subject));
}));

export default tests;
