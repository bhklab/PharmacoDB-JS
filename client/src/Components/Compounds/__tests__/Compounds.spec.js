import React from 'react';
import { mount } from 'enzyme';
import Compounds from '../Compounds';
import { getCompoundsQuery } from '../../../queries/queries';
import { MockedProvider } from '@apollo/react-testing';

const mocks = [
  {
    request: {
      query: getCompoundsQuery,
    },
    result: {
      data: {
        compounds: { id: 1, name: "testDrug" },
      },
    },
  },
];

it('renders correctly without props', () => {
  // must use mount to access Compounds (because child component)
  const component = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Compounds />
    </MockedProvider>,
  );
  expect(component).toMatchSnapshot();
});

