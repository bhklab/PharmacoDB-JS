import styled from 'styled-components';

const StyledSelectContainer = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    .selector-container {
        min-width: 25%;
        max-width: 400px;
        margin-right: 15px;

        h4 {
            margin: 0 0 5px;
        }
    }
`;

export default StyledSelectContainer;
