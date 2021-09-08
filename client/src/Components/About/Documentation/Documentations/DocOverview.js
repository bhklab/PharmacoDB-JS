import React from 'react';
import styled from "styled-components";
import { Player } from 'video-react';

const DocHeader = styled.div`
    margin-top: 20px;
    .title {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 3px solid rgb(241, 144, 33);
    }
`;

const Overview = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Overview</h2>
            </DocHeader>
        </div>
    );
}
export default Overview;
