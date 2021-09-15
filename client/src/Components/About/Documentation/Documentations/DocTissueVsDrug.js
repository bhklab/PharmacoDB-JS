import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the Tissue vs. Drug description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocTissueVsDrug/>
 * )
 */
const DocTissueVsDrug = () => {
    return(
        <div className='documentation'>
            <p>
                Each tissue-drug combination included in PharmacoDB has a webpage associated with it. This page can be accessed by typing the names of the tissue and drug into the search bar, separated by a space. The order of tissue and drug names do not matter.
            </p>
            <img width="650px"  alt="screenshot of searching tissue/drug pair" src={doseImg} title="Searching tissue/drug pair" />
            <p>
                The page contains a plot recording the doses of that drug tested on that tissue in each dataset, along with the cell viability values that were observed at those doses. The curves can be filtered by dataset and highlighted by cell line. There is also a summary statistics table which has hoverable/clickable statistics for each cell line.
            </p>
            <img width="650px"  alt="screenshot of tissue/drug pair page" src={doseImg} title="Tissue/drug pair" />
        </div>
    );
}
export default DocTissueVsDrug;
