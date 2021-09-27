import React from 'react';
import tissueDrug from '../../../../images/DocumentationImages/tissuebreast_drugpacli.png';
import tissueDrugPlot from '../../../../images/DocumentationImages/breast_pacli_plot 3.16.23 PM.png';
import tissueDrugTable from '../../../../images/DocumentationImages/breast_pacli_table.png';
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
            <p>Each tissue-compound combination included in PharmacoDB has a webpage associated with it. This page can be accessed by typing the names of the tissue and compound into the search bar, separated by a space. The order of tissue and compound names do not matter.</p>
            <div className="center"><img src={tissueDrug}/></div>
            <p>The page starts with a plot recording the doses of the compound of query tested on the tissue of query in each dataset, along with the cell viability values that were observed at those doses. The curves can be filtered by datasets and highlighted by cell lines using the selection squares on the right side of the plot. Clicking on each curve highlights all the curves associated with the cell line pertaining to that curve.</p>
            <div className="center"><img src={tissueDrugPlot}/></div>
            <p>The page concludes with a table reporting the cell line names, datasets including each cell line, and statistics such as AAC, IC50, EC50 and Einf. Clicking on each name or value in the table directs you to the corresponding page.</p>
            <div className="center"><img className="small" src={tissueDrugTable}/></div>
        </div>
    );
}
export default DocTissueVsDrug;
