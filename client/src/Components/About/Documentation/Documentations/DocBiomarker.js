import React, {useState} from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the Biomarker description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocBiomarker/>
 * )
 */
const DocBiomarker = () => {
    return(
        <div className='documentation'>
            <p>Biomarker query is feasible through searching for a combination of a drug, gene and tissue from the search bar. Through this query you can view the association of a marker (gene) of interest with the drug pan cancer as well as in a specific tissue. If the tissue is not specified the query will be pan-cancer.</p>
            <p>Biomarker query directs you to the corresponding page with a sidebar including Forest Plot, Manhattan Plot, Gene Information, and Compound Information.</p>
            <p>Forest plot page includes a forest plot indicating the association between the drug and gene of the query in the tissue type of interest in each PharmacoDB dataset that includes them.  There is a molecular profile selector allowing to review the association according to the chosen profile. The significant associations (FDR &lt; 0.05 and pearson correlation coefficient, r &gt; 0.7) are highlighted in pink. You can view the strength of the association as well as the correlation confidence intervals by hovering over the horizontal lines.</p>
            <p>Manhattan Plot page includes a plot showing the association between the drug and gene of query in the tissue type of interest. There is a molecular profile selector allowing to review the association according to the chosen profile. The genomic coordinates are displayed on the x-axis, and negative logarithm of the association p-value is displayed on the y-axis. The different colors of each block show the extent of each chromosome. Hovering over each colored block shows the name of the corresponding gene, the PharmacoDB dataset from which the data is fetched, chromosome number, and negative logarithm of the association p-value.</p>
            <p>The Gene Information page contains a table representing whether the gene is a drug target, Ensembl ID of the gene, and it’s location.</p>
            <p>Compound Information page has a table showing the FDA approval status of the drug, active trials pertaining to it, and the annotated targets of the drug.</p>
        </div>
    );
}
export default DocBiomarker;
