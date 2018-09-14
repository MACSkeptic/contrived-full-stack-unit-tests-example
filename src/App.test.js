import { fireEvent, waitForElement, cleanup } from 'react-testing-library';
import * as http from './animals/fetch.js';
import sinon from 'sinon';
import _ from 'lodash';
import { tests } from './secret.js';

_.tap(sinon.createSandbox(), (sandbox) => {
  afterEach(() => {
    cleanup();
    sandbox.restore();
  });
  tests((render) => () => {
    it('allows users to pick between magical, real, and all', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (new Promise(_.noop)));
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('real', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('all', { exact: false })))
      ));
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
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('🐑', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('sheep', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('🐈', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('cat', { exact: false })))
      ));
    });
    it('renders an error on navigation', () => {
      _.tap(sandbox.stub(http, 'httpGetAnimals'), (stub) => ([
        stub.onCall(0).resolves([]),
        stub.onCall(1).rejects(new Error('onoes'))
      ]));
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('onoes', { exact: false })))
      ));
    });
    it('renders a loading indicator on navigation', () => {
      _.tap(sandbox.stub(http, 'httpGetAnimals'), (stub) => ([
        stub.onCall(0).resolves([]),
        stub.onCall(1).returns(new Promise(_.noop))
      ]));
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('magical', { exact: false })))
        .then((link) => fireEvent.click(link))
        .then(() => waitForElement(() => rendered.getByText('loading', { exact: false })))
      ));
    });
    it('renders a loading indicator on first load', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (new Promise(_.noop)));
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('loading', { exact: false })))
      ));
    });
    it('renders an error on first load', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => Promise.reject(new Error('onoes')));
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('onoes', { exact: false })))
      ));
    });
    it('renders a sheep on first load', () => {
      sandbox.stub(http, 'httpGetAnimals').callsFake(() => (
        Promise.resolve([{
          emoji: '🐑',
          name: 'sheep'
        }])
      ));
      return _.thru(render(), (rendered) => (Promise.resolve()
        .then(() => waitForElement(() => rendered.getByText('🐑', { exact: false })))
        .then(() => waitForElement(() => rendered.getByText('sheep', { exact: false })))
      ));
    });
  });
});
