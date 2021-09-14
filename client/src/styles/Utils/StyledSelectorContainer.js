import styled from 'styled-components';

const StyledSelectContainer = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    .selector-container {
        font-size: 14px;
        display: flex;
        align-items: center;
        width: 49%;
        min-width: 150px;
        max-width: 350px;
        margin-right: 15px;
        .label {
            margin-right: 10px;
        }
        .selector {
            width: 60%;
        }
    }
    .single-selector-container {
      font-size: 14px;
      align-items: center;
      width: 49%;
      min-width: 150px;
      max-width: 350px;
      margin-left: 65%;
      .label {
        margin-right: 10px;
      }
      .selector {
        width: 60%;
      }
    }
`;

export default StyledSelectContainer;
