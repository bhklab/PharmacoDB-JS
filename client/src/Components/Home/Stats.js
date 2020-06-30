import React from 'react';
import styled from 'styled-components';

import compoundsImg from '../../images/compounds.png';
import cellsImg from '../../images/cells.png';
import datasetsImg from '../../images/datasets.png';
import experimentsImg from '../../images/experiments.png';
import genesImg from '../../images/genes.png';
import tissuesImg from '../../images/tissues.png';
import colors from '../../styles/colors';

const StyledStats = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-evenly;

    width: 80%;
    margin-top:15vh;
    margin-bottom:20vh; //TODO: REMOVE
    background: ${colors.light_blue_bg};
    height: 14vw;
    border-radius:calc(1vw + 0.6em);
    // -webkit-box-shadow: 0px 0px 22px 7px rgba(220,229,232,1);
    // -moz-box-shadow: 0px 0px 22px 7px rgba(220,229,232,1);
    // box-shadow: 0px 0px 22px 7px rgba(220,229,232,1);

    .item-container {
        // width:calc(5.8vw + 40px);
        // height:calc(9vw + 30px);
        // border-radius:calc(1vw + 0.5em);
        background: ${colors.light_blue_bg};
        
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;

        img {
            width: calc(4vw + 35px);
            margin-bottom:1vw;
        }
        .text {
            color: ${colors.dark_teal_heading};
            font-size: calc(0.8vw + 0.3em);
            text-align:center;
            font-family: 'Rubik', sans-serif;
            font-weight: 400;
        }
        .big {
            font-size: calc(0.9vw + 0.4em);
        }
    }
`;
/**
 * Shows the stats with graphics on the front page.
 * 
 * @component
 * @example
 * 
 * return (
 *   <Stats/>
 * )
 */
const Stats = () => {
    return (
        <StyledStats>
            <div className="item-container">
                <img src={datasetsImg}/>
                <div className="text">
                    <span className="big">7</span><br/>
                    datasets
                </div>
            </div>
            <div className="item-container">
                <img src={tissuesImg}/>
                <div className="text">
                    <span className="big">41</span><br/>
                    tissues
                </div>
            </div>
            <div className="item-container">
                <img src={cellsImg}/>
                <div className="text">
                    <span className="big">1,691</span><br/>
                    cell-lines
                </div>
            </div>
            <div className="item-container">
                <img src={experimentsImg}/>
                <div className="text">
                    <span className="big">650,894</span><br/>
                    experiments
                </div>
            </div>
            <div className="item-container">
                <img src={genesImg}/>
                <div className="text">
                    <span className="big">19,933</span><br/>
                    genes
                </div>
            </div>
            <div className="item-container">
                <img src={compoundsImg}/>
                <div className="text">
                    <span className="big">759</span><br/>
                    compounds
                </div>
            </div>
        </StyledStats>
    )
};

export default Stats;