import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { wait, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// for async tests - DO NOT REMOVE
import regeneratorRuntime from 'regenerator-runtime';
import IndivCompounds from '../Components/IndivCompounds/IndivCompounds';
import { getCompoundQuery } from '../queries/queries';

const mocks = [
  {
    request: {
      query: getCompoundQuery,
      variables: {
        compoundId: 1,
      },
    },
    result: {
      data: {
        compound: {
          compound: {
            id: '1',
            name: 'testDrug',
            annotation: {
              smiles: 'OCO',
              inchikey: '0',
              pubchem: '0',
            },
          },
        },
      },
    },
  },
];

/**
 * Util function to return the IndivCompounds component with certain id.
 *
 * @param {Str} id The id str.
 * @returns {ReactWrapper} the component mounted
 */
const mountIndivCompounds = (id) => mount(
  <MockedProvider mocks={mocks} addTypename={false}>
    <BrowserRouter>
      <IndivCompounds match={{ params: { id } }} />
    </BrowserRouter>
  </MockedProvider>,
);

// General snapshot testing
describe('IndivCompounds renders correctly with a mocked query and', () => {
  test('an invalid id prop (ex. null)', async () => {
    // must use mount to access IndivCompounds (because child component)
    const component = mountIndivCompounds('null');
    await act(wait);
    expect(component).toMatchSnapshot();
  });

  test('a valid id prop', async () => {
    // must use mount to access IndivCompounds (because child component)
    const component = mountIndivCompounds('1');
    await act(wait);
    expect(component).toMatchSnapshot();
  });
});
