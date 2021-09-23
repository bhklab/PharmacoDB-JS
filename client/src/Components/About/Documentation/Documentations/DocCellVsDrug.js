import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the Cell line Vs Drug description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocCellVsDrug/>
 * )
 */
const DocCellVsDrug = () => {
    return(
        <div className='documentation'>
            <p>Each cell line-drug combination included in PharmacoDB has a webpage associated with it. This page can be accessed by typing the names of the cell line and drug into the search bar, separated by a space. The order of cell line and drug names do not matter.</p>
            <img width="650px"  alt="screenshot of searching cell line/drug pair" src={doseImg} title="Searching cell-line/drug pair" />
            <p>The page starts with a plot recording the doses at which the drug of query tested on the cell line of query in each dataset, along with the cell viability values that were observed at those doses. Each replicate from each dataset of the experiment is plotted separately. Hovering over each point on the plot shows the name of the associated dataset as well as the dose and viability response measures of the experiment.</p>
            <img width="650px"  alt="screenshot of cell line/drug pair plot" src={doseImg} title="Cell-line/drug pair" />
            <p>The page concludes with a table summarising measurements such as AAC, IC50, EC50 and Einf where available. Clicking on each dataset name or value directs you to the corresponding page.</p>
            <img width="650px"  alt="screenshot of cell line/drug pair table" src={doseImg} title="Cell-line/drug pair" />
        </div>
    );
}
export default DocCellVsDrug;
