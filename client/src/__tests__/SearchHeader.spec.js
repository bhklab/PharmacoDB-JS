import React from 'react';
import { mount } from 'enzyme';
// wrap in browserrouter or it produces an error that
// says you can't use link outside a router
import { BrowserRouter } from 'react-router-dom';
import SearchHeader from '../Components/SearchHeader/SearchHeader';
import PageContext from '../context/PageContext';

/**
 * Util function to return a component wrapped in given context.
 *
 * @param {String} page The current page (home or empty str)
 * @returns {ReactWrapper} the component mounted
 */
const mountSearchHeader = (page) => mount(
  <PageContext.Provider value={page}>
    <BrowserRouter>
      <SearchHeader />
    </BrowserRouter>
  </PageContext.Provider>,
);

// Catch-all snapshot tests for entire rendering of the search header
describe('Search Header renders correctly on', () => {
  test('the home page', () => {
    const component = mountSearchHeader('home');
    expect(component).toMatchSnapshot();
  });

  test('pages other than home', () => {
    // in other pages, the page prop simply isn't passed because
    // it doesn't matter what the page is, as long as it's not home.
    const component = mountSearchHeader('');
    expect(component).toMatchSnapshot();
  });
});

// Integration test: visibility
