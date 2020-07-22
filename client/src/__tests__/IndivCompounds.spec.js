import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { wait, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// for async tests
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

// it('renders correctly with a mocked query and no id prop', () => {
//   // must use mount to access IndivCompounds (because child component)
//   const component = mount(
//     <MockedProvider mocks={mocks} addTypename={false}>
//       <IndivCompounds />
//     </MockedProvider>,
//   );
//   expect(component).toMatchSnapshot();
// });

it('renders correctly with a mocked query and id prop', async () => {
  // must use mount to access IndivCompounds (because child component)
  const component = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <IndivCompounds match={{ params: { id: '1' } }} />
      </BrowserRouter>
    </MockedProvider>,
  );
  await act(wait);
  expect(component).toMatchSnapshot();
});
