import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import Experiments from '../Components/SummaryComponents/Experiments/Experiments';
import { getDatasetStatsQuery } from '../queries/dataset';
import updateWrapper from '../test_utils/updateWrapper';

const mocks = [
  {
    request: {
      query: getDatasetStatsQuery,
    },
    result: {
      data: {
        datasets: [
          {
            id: 1,
            name: 'CCLE',
            compound_tested_count: 24,
            cell_count: 1061,
            experiment_count: 11670,
          },
          {
            id: 2,
            name: 'CTRPv2',
            compound_tested_count: 544,
            cell_count: 888,
            experiment_count: 395263,
          },
          {
            id: 3,
            name: 'FIMM',
            compound_tested_count: 52,
            cell_count: 50,
            experiment_count: 2561,
          },
          {
            id: 4,
            name: 'gCSI',
            compound_tested_count: 16,
            cell_count: 754,
            experiment_count: 6455,
          },
          {
            id: 5,
            name: 'GDSC1000',
            compound_tested_count: 250,
            cell_count: 1109,
            experiment_count: 225480,
          },
          {
            id: 6,
            name: 'GRAY',
            compound_tested_count: 90,
            cell_count: 84,
            experiment_count: 9413,
          },
          {
            id: 7,
            name: 'UHNBreast',
            compound_tested_count: 4,
            cell_count: 84,
            experiment_count: 52,
          },
        ],
      },
    },
  },
];

/**
 * Util function to return the Experiments component.
 *
 * @returns {ReactWrapper} the component mounted
 */
const mountExperiments = () => {
  const component = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <Experiments />
      </BrowserRouter>
    </MockedProvider>,
  );
  return component;
};

// General snapshot testing
describe('Experiments renders correctly with a mocked query and', () => {
  test('test the component', async () => {
    // must use mount to access Experiments (because child component)
    const component = mountExperiments();
    await updateWrapper(component);
    expect(component).toMatchSnapshot();
  });
});
