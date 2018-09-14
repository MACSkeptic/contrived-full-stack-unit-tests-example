import React from 'react';
import { fireEvent, render, waitForElement, cleanup } from 'react-testing-library';
import App from './App';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from './redux/store.js';
import * as http from './animals/fetch.js';
import sinon from 'sinon';
import _ from 'lodash';

const sandbox = sinon.createSandbox();

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
    it('allows users to pick between context and redux', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (new Promise(_.noop)));
      const rendered = subject();
      return Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('context', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('redux', { exact: false })));
    });
    it('allows users to pick between magical, real, and all', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (new Promise(_.noop)));
      const rendered = subject();
      return Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('real', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('all', { exact: false })));
    });
    it('filters when the menu is clicked', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake((filter) => (
        (filter === 'magical') ? Promise.resolve([{
          emoji: '🐈',
          name: 'cat'
        }]) : Promise.resolve([{
          emoji: '🐑',
          name: 'sheep'
        }])
      ));
      const rendered = subject();
      return Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('sheep', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('cat', { exact: false })));
    });
    it('renders an error on navigation', () => {
      _.tap(sandbox.stub(http, 'httpGetAnimals'), (stub) => ([
        stub.onCall(0).resolves([]),
        stub.onCall(1).rejects(new Error('onoes'))
      ]));
      const rendered = subject();
      return Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('onoes', { exact: false })));
    });
    it('renders a loading indicator on navigation', () => {
      _.tap(sandbox.stub(http, 'httpGetAnimals'), (stub) => ([
        stub.onCall(0).resolves([]),
        stub.onCall(1).returns(new Promise(_.noop))
      ]));
      const rendered = subject();
      return Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('loading', { exact: false })));
    });
    it('renders a loading indicator on first load', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (new Promise(_.noop)));
      const rendered = subject();
      return waitForElement(() => rendered.getByText('loading', { exact: false }));
    });
    it('renders an error on first load', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => Promise.reject(new Error('onoes')));
      const rendered = subject();
      return waitForElement(() => rendered.getByText('onoes', { exact: false }));
    });
    it('renders a sheep on first load', () => {
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
