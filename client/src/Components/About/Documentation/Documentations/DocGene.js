import React from 'react';
import homeGene from '../../../../images/DocumentationImages/homeGene.PNG';
import geneSummaryBar from '../../../../images/DocumentationImages/geneSummaryBar.png';
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
            <img width="600px" alt="Highlighted genes on navigation bar"  src={homeGene} title="Genes"/>
            <p>Genes webpage starts with a bar plot displaying the frequency of unique gene targets per drug. Hovering over each bar shows the exact frequency.</p>
            <img width="600px" alt="target frequency bar plot"  src={geneSummaryBar} title="Targets"/>
            <p>The webpage concludes with a table listing the names and symbols of all the genes reported in any of the PharmacoDB datasets. The genes can be accessed either by clicking on their names, or by searching through the search bar above the table.</p>
            <img width="600px" alt="list of genes- gene summary table"  src={geneSummaryList} title="Genes" />
        </div>
    );
}
export default DocGene;
