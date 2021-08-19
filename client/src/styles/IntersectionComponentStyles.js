import styled from 'styled-components';
import colors from './colors';

const StyledIntersectionComponent = styled.div`
    a {
        text-decoration: none;
        color ${colors.dark_pink_highlight};
    }
`;

const StyledIntersectionSummaryTable = styled.div`
    margin-top: 50px;
    .title {
        margin-bottom: 20px;
    }
    tbody {
        td {
            :hover {
                background-color: ${colors.light_teal};
            }
        }
    }
    .clicked {
        color: ${colors.dark_pink_highlight};
    }
    .download-button {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        margin-bottom: 30px;
    }
`;

const StyledCell = styled.button`
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: none;
    background: none;
    color: ${colors.dark_gray_text};
    :disabled {
        color: #dddddd;
        cursor: default;
    }
`;

export { 
    StyledIntersectionComponent,
    StyledIntersectionSummaryTable,
    StyledCell
};