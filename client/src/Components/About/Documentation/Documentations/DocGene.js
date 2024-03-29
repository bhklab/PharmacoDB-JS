import React from 'react';
import homeGene from '../../../../images/DocumentationImages/homeGenes.png';
import geneSummaryBar from '../../../../images/DocumentationImages/genes_targets.png';
import geneSummaryPlot from '../../../../images/DocumentationImages/geneSummaryPlot.png';
import geneSummaryList from '../../../../images/DocumentationImages/geneSummaryList.png'

/**
 * Shows the Gene description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocGene/>
 * )
 */
const DocGene = () => {
    return(
        <div className='documentation'>
            <p>Genes webpage is accessible from the experiments link at the bottom of the homepage or from the Data drop down menu on the top right side of the homepage.</p>
            <div className="center"><img className="bar" src={homeGene}/></div>
            <p>Genes webpage starts with a bar plot displaying the frequency of unique gene targets per compound. Hovering over each bar shows the exact frequency.</p>
            <div className="center"><img src={geneSummaryBar}/></div>
            <p>The webpage concludes with a table listing the names and symbols of all the genes reported in any of the PharmacoDB datasets. The genes can be accessed either by clicking on their names, or by searching through the search bar above the table.</p>
            <div className="center"><img src={geneSummaryList}/></div>
        </div>
    );
}
export default DocGene;
