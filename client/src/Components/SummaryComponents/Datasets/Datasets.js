import React , {useState}from 'react';
import { useQuery } from '@apollo/react-hooks';
import Table from '../../UtilComponents/Table/Table';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Layout from '../../UtilComponents/Layout';
import { getDatasetsQuery } from '../../../queries/dataset';
import StyledWrapper from '../../../styles/utils';
import Loading from '../../UtilComponents/Loading';
import DatasetIntersection from '../../IntersectionComponents/DatasetIntersection/DatasetIntersection';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';

// an array with the columns of dataset table.
const table_columns = [
  {
    Header: 'Name',
    accessor: 'name',
    center: true,
    Cell: (row) => (<Link to={`/datasets/${row.row.original.id}`}>{row.value}</Link>),
  },
];

/**
 *
 * @param {boolean} loading
 * @param {Error} error - takes the error as a param that is returned by the useQuery in case there is one.
 * @param {Array} columns
 * @param {Array} data
 */
const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <React.Fragment>
      <DatasetIntersection />
      <h2>Dataset names</h2>
      <Table columns={columns} data={data} center={true}/>
    </React.Fragment>
  );
};

/**
 * Parent component for the datasets page.
 *
 * @component
 * @example
 *
 * returns (
 *   <Datasets/>
 * )
*/
const Datasets = () => {
  const { loading, error, data } = useQuery(getDatasetsQuery);
  const columns = React.useMemo(() => table_columns, []);
  const dataset_data = React.useMemo(() => (data ? data.datasets : []), [data]);
  const TypeOptions = ['Cell Line', 'Compound', 'Tissue'];
  const [selectedDataset, setSelectedDataset] = useState('Cell Line');
  return (
    <Layout page="datasets">
      <StyledWrapper>
        <StyledSelectorContainer>
          <div className="selector-container">
            <div className='label'>Dataset:</div>
            <Select
                className='selector'
                defaultValue={{ value: selectedDataset, label: selectedDataset }}
                options={TypeOptions}
                onChange={(e) => setSelectedDataset(e.value)}
            />
          </div>
        </StyledSelectorContainer>
        {
          renderComponent(loading, error, columns, dataset_data)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Datasets;
