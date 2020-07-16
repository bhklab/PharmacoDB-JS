import styled from 'styled-components';
import colors from './colors';

const StyledWrapper = styled.div`
    margin-top: 5vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    & > * {
        width: 70%;
    }
`;

export default StyledWrapper;
