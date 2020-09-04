import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import IndivCompounds from '../Components/IndividualComponents/IndivCompounds/IndivCompounds';
import { getCompoundQuery } from '../queries/compound';
import updateWrapper from '../test_utils/updateWrapper';

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
              fda_status: 'Approved',
            },
          },
          synonyms: [
            {
              name: 'Drug',
              source: ['Dataset1', 'Dataset2'],
            },
          ],
          targets: [
            {
              id: 1,
              name: 'Target',
            },
          ],
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
const mountIndivCompounds = (id) => {
  const component = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <IndivCompounds match={{ params: { id } }} />
      </BrowserRouter>
    </MockedProvider>,
  );
  return component;
};

// General snapshot testing
describe('IndivCompounds renders correctly with a mocked query and', () => {
  test('an invalid id prop (ex. null)', async () => {
    // must use mount to access IndivCompounds (because child component)
    const component = mountIndivCompounds('null');
    await updateWrapper(component);
    expect(component).toMatchSnapshot();
  });

  test('a valid id prop', async () => {
    // must use mount to access IndivCompounds (because child component)
    const component = mountIndivCompounds('1');
    await updateWrapper(component);
    expect(component).toMatchSnapshot();
  });
});
