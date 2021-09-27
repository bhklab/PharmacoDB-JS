import React, {useState} from 'react';
import geneCompoundSearch from '../../../../images/DocumentationImages/geneCompoundSearch.png';
import geneCompounTissueSearch from '../../../../images/DocumentationImages/geneCompoundTissueSearch.png';
import biomarkerComp from '../../../../images/DocumentationImages/biomarker_comp.png';
import biomarkerForest from '../../../../images/DocumentationImages/biomarker_forest.png';
import biomarkerGene from '../../../../images/DocumentationImages/biomarker_gene.png';
import biomarkerManhattan from '../../../../images/DocumentationImages/biomarker_manhattan.png';

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
            <p>Biomarker query is feasible through searching for a combination of a compound, gene and tissue from the search bar. Through this query you can view the association of a marker (gene) of interest with the compound pan cancer as well as in a specific tissue. If the tissue is not specified the query will be pan-cancer.</p>
            <div className="center"><img src={geneCompoundSearch}/></div>
            <div className="center"><img src={geneCompounTissueSearch}/></div>
            <p>Biomarker query directs you to the corresponding page with a sidebar including Forest Plot, Manhattan Plot, Gene Information, and Compound Information.</p>
            <p>Forest plot page includes a forest plot indicating the association between the compound and gene of the query in the tissue type of interest in each PharmacoDB dataset that includes them.  There is a molecular profile selector allowing to review the association according to the chosen profile. The significant associations (FDR &lt; 0.05 and pearson correlation coefficient, r &gt; 0.7) are highlighted in pink. You can view the strength of the association as well as the correlation confidence intervals by hovering over the horizontal lines.</p>
            <div className="center"><img src={biomarkerForest}/></div>
            <p>Manhattan Plot page includes a plot showing the association between the compound and gene of query in the tissue type of interest. There is a molecular profile selector allowing to review the association according to the chosen profile. The genomic coordinates are displayed on the x-axis, and negative logarithm of the association p-value is displayed on the y-axis. The different colors of each block show the extent of each chromosome. Hovering over each colored block shows the name of the corresponding gene, the PharmacoDB dataset from which the data is fetched, chromosome number, and negative logarithm of the association p-value.</p>
            <div className="center"><img src={biomarkerManhattan}/></div>
            <p>The Gene Information page contains a table representing whether the gene is a compound target, Ensembl ID of the gene, and it’s location.</p>
            <div className="center"><img src={biomarkerGene}/></div>
            <p>Compound Information page has a table showing the FDA approval status of the compound, active trials pertaining to it, and the annotated targets of the compound.</p>
            <div className="center"><img src={biomarkerComp}/></div>
        </div>
    );
}
export default DocBiomarker;
