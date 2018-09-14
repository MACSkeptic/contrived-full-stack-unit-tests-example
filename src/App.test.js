import React from 'react';
import { fireEvent, render, waitForElement, wait, cleanup } from 'react-testing-library';
import App from './App';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './redux/store.js';
import * as http from './animals/fetch.js';
import sinon from 'sinon';
import _ from 'lodash';

const sandbox = sinon.createSandbox();

/* eslint-disable no-console */
console.log = _.noop;
console.info = _.noop;
/* eslint-enable no-console */

afterEach(() => {
  cleanup();
  sandbox.restore();
});

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

[
  ['redux', renderUsingRedux],
  ['context', renderUsingContext]
].forEach(([framework, subject]) => {
  describe(`tests using ${framework}`, () => {
    it('filters when the menu is clicked', () => {
      const stub = sandbox.stub(http, 'httpGetAnimals').callsFake((filter) => (
        (filter === 'magical') ? Promise.resolve([{
          emoji: '🐈',
          name: 'cat'
        }]) : Promise.resolve([{
          emoji: '🐑',
          name: 'sheep'
        }])
      ));
      const rendered = subject();
      return wait(() => expect(stub.called).toEqual(true))
        .then(() => waitForElement(() => rendered.getByText('sheep', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('cat', { exact: false })));
    });
    it('renders a loading indicator', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (new Promise(_.noop)));
      const rendered = subject();
      return waitForElement(() => rendered.getByText('loading', { exact: false }));
    });
    it('renders an error', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => Promise.reject(new Error('onoes')));
      const rendered = subject();
      return waitForElement(() => rendered.getByText('onoes', { exact: false }));
    });
    it('renders a sheep', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (
        Promise.resolve([{
          emoji: '🐑',
          name: 'sheep'
        }])
      ));
      const rendered = subject();
      return waitForElement(() => rendered.getByText('sheep', { exact: false }));
    });
  });
});
