import React from 'react';
import { waitForElement, cleanup, render } from 'react-testing-library';
import { AnimalList } from './AnimalList.js';

afterEach(() => {
  cleanup();
});
describe('traditional component tests', () => {
  it('renders a loading indicator when the list is loading', () => {
    const { getByText } = render(<AnimalList loading />);
    return waitForElement(() => getByText('loading', { exact: false }));
  });
  it('renders an error when there is an error', () => {
    const { getByText } = render(<AnimalList error={new Error('onoes')} />);
    return waitForElement(() => getByText('onoes', { exact: false }));
  });
  it('renders data when it is cached', () => {
    const { getByText } = render(<AnimalList cached data={[{ name: 'cat', emoji: '🐈' }]} />);
    return waitForElement(() => getByText('cat', { exact: false }));
  });
});
