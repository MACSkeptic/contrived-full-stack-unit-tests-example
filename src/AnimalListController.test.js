import _ from 'lodash';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { waitForElement, cleanup, render } from 'react-testing-library';
import { AnimalListController } from './AnimalList.js';
import sinon from 'sinon';

afterEach(() => {
  cleanup();
});
describe('traditional component tests', () => {
  describe('AnimalListController', () => {
    it('renders a loading indicator when the list is loading', () => {
      const { getByText } = render(
        <MemoryRouter>
          <AnimalListController
            fetch={_.noop}
            match={{ params: { index: 'all' } }}
            animals={{ loading: true }}
          />
        </MemoryRouter>
      );
      return waitForElement(() => getByText('loading', { exact: false }));
    });
    it('renders an error when there is an error', () => {
      const { getByText } = render(
        <MemoryRouter>
          <AnimalListController
            fetch={_.noop}
            match={{ params: { index: 'all' } }}
            animals={{ error: new Error('onoes') }}
          />
        </MemoryRouter>
      );
      return waitForElement(() => getByText('onoes', { exact: false }));
    });
    it('renders data when it is cached', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={['/animals/all']}>
          <Route path="/animals/:index" render={(routerProps) => (
            <AnimalListController
              {...routerProps}
              fetch={_.noop}
              animals={{ data: [{ name: 'cat', emoji: '🐈' }], cached: true }}
            />
          )}/>
        </MemoryRouter>
      );
      return waitForElement(() => getByText('cat', { exact: false }));
    });
    it('fetches on mount', () => {
      const fetchStub = sinon.stub();
      render(
        <MemoryRouter initialEntries={['/animals/magical']}>
          <Route path="/animals/:index" render={(routerProps) => (
            <AnimalListController
              {...routerProps}
              fetch={fetchStub}
              animals={{}}
            />
          )}/>
        </MemoryRouter>
      );
      expect(fetchStub.called).toEqual(true);
      expect(fetchStub.lastCall.args[0]).toEqual('magical');
    });
    it('fetches again when the url changes');
  });
});
