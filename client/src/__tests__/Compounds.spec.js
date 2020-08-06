import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
// for async tests - DO NOT REMOVE
import regeneratorRuntime from 'regenerator-runtime';
import Compounds from '../Components/Compounds/Compounds';
import { getCompoundsQuery } from '../queries/compound';

const mocks = [
  {
    request: {
      query: getCompoundsQuery,
    },
    result: {
      data: {
        compounds: [{
          id: 1,
          name: 'testDrug',
          annotation: {
            smiles: '',
            inchikey: '',
            pubchem: '0',
            fda_status: '',
          },
        }],
      },
    },
  },
];

/**
 * Util function to return the Compounds component
 *
 * @returns {ReactWrapper} the component mounted
 */
const mountCompounds = async (id) => {
  let component;
  await act(async () => {
    component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Compounds />
        </BrowserRouter>
      </MockedProvider>,
    );
    component.update();
    return component;
  });
};

it('renders Compounds correctly with a mocked query', async () => {
  // must use mount to access Compounds (because child component)
  const component = mountCompounds();
  expect(component).toMatchSnapshot();
});
