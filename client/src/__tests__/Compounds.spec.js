import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import Compounds from '../Components/Compounds/Compounds';
import { getCompoundsQuery } from '../queries/queries';

const mocks = [
  {
    request: {
      query: getCompoundsQuery,
    },
    result: {
      data: {
        compounds: { id: 1, name: 'testDrug' },
      },
    },
  },
];

it('renders correctly with a mocked query', () => {
  // must use mount to access Compounds (because child component)
  const component = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Compounds />
    </MockedProvider>,
  );
  expect(component).toMatchSnapshot();
});
