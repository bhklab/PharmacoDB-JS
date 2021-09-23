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
            <p>Each tissue-drug combination included in PharmacoDB has a webpage associated with it. This page can be accessed by typing the names of the tissue and drug into the search bar, separated by a space. The order of tissue and drug names do not matter.</p>
            {/*<img width="650px"  alt="screenshot of searching tissue/drug pair" src={doseImg} title="Searching tissue/drug pair" />*/}
            <p>The page starts with a plot recording the doses of the drug of query tested on the tissue of query in each dataset, along with the cell viability values that were observed at those doses. The curves can be filtered by datasets and highlighted by cell lines using the selection squares on the right side of the plot. Clicking on each curve highlights all the curves associated with the cell line pertaining to that curve.</p>
            {/*<img width="650px"  alt="screenshot of tissue/drug pair page" src={doseImg} title="Tissue/drug pair" />*/}
            <p>The page concludes with a table reporting the cell line names, datasets including each cell line, and statistics such as AAC, IC50, EC50 and Einf. Clicking on each name or value in the table directs you to the corresponding page.</p>
            {/*<img width="650px"  alt="table" src={doseImg} title="Tissue/drug pair" />*/}
        </div>
    );
}
export default DocTissueVsDrug;
