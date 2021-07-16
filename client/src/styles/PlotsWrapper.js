import styled from 'styled-components';
import colors from './colors';

// container that wraps around more than 1 plot
const PlotsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;

  .plot {
    width: calc(50% - 10px);
  }

  @media only screen and (max-width: 765px) {
    flex-direction: column;
    .plot {
      width: 100%;
    }
  }
`;

export default PlotsWrapper;
