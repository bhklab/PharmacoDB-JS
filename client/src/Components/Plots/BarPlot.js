import Plot from 'react-plotly.js';
import { useQuery } from '@apollo/react-hooks';
import datasets from '../../utils/datasetsList';
import Loading from '../UtilComponents/Loading';
import Error from '../UtilComponents/Error';
import React, { useState, useMemo, useEffect } from 'react';
import { getDatasetStatsQuery } from '../../queries/dataset'

const layout = {
  autosize: true,
  height: 530,
  margin: {
    t: 50,
  },
  yaxis: {
    type: 'log',
    tickvals : [0, 10, 100, 1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000],
    ticktext : [0, 10, 100, 1000, '10k', '50k', '100k', '500k', '1M', '5M', '10M'],
  },
};

const config = {
  responsive: true,
  displayModeBar: false,
};

const parsePlotData = (data) => {
  let plotData = {
    x: [],
    y: [],
    type: 'bar',
    marker: {
      color: ['#084081', '#0868ac', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#e0f3db', '#eff8e4', '#f7fcf0'],
    },
  }
  if (typeof data !== 'undefined') {
    // descendingly sort datasets based on counts
    const sorted = data.sort((a, b) => (a.compound_count < b.compound_count) ? 1 : -1);

    sorted.forEach(item => {
      plotData.x.push(item.dataset.name);
      plotData.y.push(item.compound_count);
    })
  };
  return plotData;
}


const BarPlot = () => {
  // load data from query into state
  const [count, setCount] = useState({
    data: {},
    loaded: false,
    notFound: false,
    error: false
  });
  const [plotData, setPlotData] = useState({
    x: [],
    y: [],
    type: 'bar',
    marker: {
      color: ['#084081', '#0868ac', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#e0f3db', '#eff8e4', '#f7fcf0'],
    },
  });
  const [error, setError] = useState(false);

  // query to get the data for the single gene.
  const { loading } = useQuery(getDatasetStatsQuery, {
    onCompleted: (data) => {
      setPlotData(parsePlotData(data.dataset_stats));
    },
    onError: (err) => {
      console.log(err);
      setError(true);
    }
  });

  return (
    <React.Fragment>
      {
        loading ? <Loading />
          :
          error ? <Error />
            :
            <Plot data={[plotData]} layout={layout} config={config} />
      }
    </React.Fragment>
  );
}

export default BarPlot;
