import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledPieChart = styled.div`
  .slice {
    cursor: ${(props) => props.clickable ? 'pointer' : ''};
  }
`;

const config = {
  responsive: true,
  displayModeBar: false,
};

const PieChart = ({ id, data, height=700, onClick }) => (
  <StyledPieChart clickable={onClick} >
    <Plot 
      divId={id}
      data={data} 
      layout={{
        height: height,
        // width: 900,
        autosize: true,
        showlegend: window.matchMedia('(min-width: 800px)').matches,
        legend: {
          font: {
            size: 13,
          },
        },
      }} 
      config={config} 
      onClick={onClick}
    />
  </StyledPieChart>
);

PieChart.propTypes = {
  data: PropTypes.arrayOf(Object).isRequired,
};

export default PieChart;
