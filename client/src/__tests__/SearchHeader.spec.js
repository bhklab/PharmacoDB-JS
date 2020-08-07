import React from 'react';
import { mount } from 'enzyme';
// wrap in browserrouter or it produces an error that
// says you can't use link outside a router
import { BrowserRouter } from 'react-router-dom';
import { act, wait } from '@testing-library/react';
// for async tests - DO NOT REMOVE
import regeneratorRuntime from 'regenerator-runtime';
import { MockedProvider } from '@apollo/react-testing';
import SearchHeader from '../Components/SearchHeader/SearchHeader';
import PageContext from '../context/PageContext';
import { getCompoundsQuery } from '../queries/compound';
import { getTissuesQuery } from '../queries/tissue';
import { getCellLinesQuery } from '../queries/cell';

// mocked request data from queries
const mocks = [
  {
    request: {
      query: getCompoundsQuery,
    },
    result: {
      compounds: {
        id: 1,
        name: 'testDrug',
        annotation: {
          smiles: '',
          inchikey: '',
          pubchem: '0',
          fda_status: '',
        },
      },
    },
    error: new Error('compounds'),
  },
  {
    request: {
      query: getTissuesQuery,
    },
    result: {
      tissues: {
        id: 1,
        name: 'testTissue',
      },
    },
    error: new Error('tissues'),
  },
  {
    request: {
      query: getCellLinesQuery,
    },
    result: {
      cell_lines: {
        id: 1,
        name: 'testCell',
        tissue: {
          id: 1,
          name: 'testTissue',
        },
      },
    },
    error: new Error('cell lines'),
  },
];

// // previous async act func
// await act(async () => {
//   component = mount(
//     <PageContext.Provider value={page}>
//       <BrowserRouter>
//         <MockedProvider mocks={mocks} addTypename={false}>
//           <SearchHeader />
//         </MockedProvider>
//       </BrowserRouter>
//     </PageContext.Provider>,
//   );
// });
/**
 * Util function to return a component wrapped in given context.
 *
 *
 * @param {String} page The current page (home or empty str)
 * @returns {ReactWrapper} the component mounted
 */
const mountSearchHeader = async (page) => {
  // async act so that options data can be set in the SearchBar useEffect
  const component = mount(
    <PageContext.Provider value={page}>
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SearchHeader />
        </MockedProvider>
      </BrowserRouter>
    </PageContext.Provider>,
  );
  await act(wait);
  component.update();
  return component;
};

/**
 * Util function to click the search button.
 *
 * @param {ReactWrapper} component The parent component (SearchHeader)
 *
 */
const clickSearchButton = (component) => {
  // use act because the method being called uses hooks
  act(() => {
    component.find('button.search-button').props().onClick();
  });

  // update the root wrapper
  component.update();
};

// Catch-all snapshot tests for entire rendering of the search header
describe('Search Header renders correctly on', () => {
  test('the home page', async () => {
    const component = await mountSearchHeader('home');
    expect(component).toMatchSnapshot();
  });

  // test('pages other than home', async () => {
  //   // in other pages, the page prop simply isn't passed because
  //   // it doesn't matter what the page is, as long as it's not home.
  //   const component = await mountSearchHeader('');
  //   expect(component).toMatchSnapshot();
  // });
});

// Integration test: visibility
// must mount entire search header because it's... ~integration~ :)
// describe('SearchHeader visibility', () => {
//   test('Navbar search button changes on click', async () => {
//     // mount search header on page other than home
//     const component = await mountSearchHeader('');

//     // IMPORTANT: you might be tempted to have
//     // const searchButton = component.find('button.search-button');
//     // However, there is no need to define a var for finding the search button.
//     // After each component update, it doesn't mutate this child button wrapper
//     // so you just have to find the component again.

//     // click search button
//     clickSearchButton(component);

//     // make sure button is the close button.
//     // method mutates the root wrapper but doesn't mutate any
//     // child wrapper so I have to find the button again
//     expect(component.find('button.search-button').children().props().alt).toBe('close');

//     // click close button
//     clickSearchButton(component);

//     // make sure the button is the search button
//     expect(component.find('button.search-button').children().props().alt).toBe('magnifying glass');
//   });

//   test('Search Container becomes visible/hidden on search button click', async () => {
//     // like above, click the search button
//     const component = await mountSearchHeader('');
//     clickSearchButton(component);

//     // determine if the search container is visible
//     expect(component.find('.search-container').hasClass('visible')).toBeTruthy();

//     // click close button, determine if search container hidden
//     clickSearchButton(component);
//     expect(component.find('.search-container').hasClass('hidden')).toBeTruthy();
//   });
// });
