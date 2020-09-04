import styled from 'styled-components';
import colors from './colors';

// container that wraps around more than 1 plot
const PlotsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  .plot {
    width: calc(50% - 10px);
  }
`;

export default PlotsWrapper;
