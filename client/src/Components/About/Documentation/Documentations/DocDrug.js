import React from 'react';
import homeCompound from '../../../../images/DocumentationImages/homeCompounds.png';
import drugSummaryBar from '../../../../images/DocumentationImages/drugSummaryBar.png';
import drugIndBar from '../../../../images/DocumentationImages/drugIndivBar.png';
import drugAACCell from '../../../../images/DocumentationImages/pacli_aac_celllines.png';
import drugAACTissue from '../../../../images/DocumentationImages/drugAACTissue.png';
import drugIndCellList from '../../../../images/DocumentationImages/drugIndCells.png';
import drugIndTissues from '../../../../images/DocumentationImages/drugIndTissues.png';
import drugSearch from '../../../../images/DocumentationImages/drugSearch.png';
import pacliSynonym from '../../../../images/DocumentationImages/pacli_synonym.png';
import pacliTarget from '../../../../images/DocumentationImages/pacli_target.png';

/**
 * Shows the Compound description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocDrug/>
 * )
 */
const DocDrug = () => {
    return(
        <div className='documentation'>
            <p>Each compound included in PharmacoDB has a webpage page associated with it. These pages can be accessed by searching for a compound through the search bar, or by clicking on the compounds link at the bottom of the homepage or from the Data drop down menu on the top right side of the homepage.</p>
            <div className="center"><img className="bar" src={drugSearch}/></div>
            <div className="center"><p>Or</p></div>
            <div className="center"><img className="bar" src={homeCompound}/></div>
            <p>Compounds link directs you to a page starting with a bar plot showing the number of compounds tested in each dataset included in PharmacoDB. Hovering over each bar shows the exact number of compounds.</p>
            <div className="center"><img src={drugSummaryBar}/></div>
            <p>The page also contains a table showing the name, SMILES, InChIKeys, PubChem name, ChEMBL, and FDA status of all the compounds included in the PharmacoDB. Clicking on each compound name will take you to the corresponding compound page.</p>
            {/*<img width="600px" alt="compound summary page- list of compounds" src={doseImg} title="Compounds"/>*/}
            <p>Each compound page has a sidebar including Synonyms and IDS, Annotated Targets, Bar Plots, AAC (Cell Lines), AAC (Tissues), Cell Line Summary, Tissue Summary, and Molecular Features.</p>
            <h7>Annotations</h7>
            <p>Annotations page displays information about the datasets which performed experiments with the compound of query as well as the name each gave to it. External identifiers such as SMILES, InChiKey and PubChem ID are also available on this page. Clicking on PubChem ID will direct you to the corresponding page on PubChem.</p>
            <div className="center"><img className="small" src={pacliSynonym}/></div>
            <h7>Annotated Targets</h7>
            <p>Annotated Targets page shows a table which includes the name of compound targets, genes associated with the targets, and Ensembl IDs of the genes.</p>
            <div className="center"><img className="small" src={pacliTarget}/></div>
            <h7>Bar Plots</h7>
            <p>Bar Plots page shows bar plots comparing the number of cells and tissues tested on with that compound in each PharmacoDB dataset. Hovering over each bar shows the exact number of cells/tissues for that dataset.</p>
            <div className="center"><img className="small" src={drugIndBar}/></div>
            <h7>AAC (Cell Lines)</h7>
            <p>AAC (Cell Lines) page shows a waterfall plot displaying the most and least sensitive cell lines tested with the compound. There is a profile selector to show the AAC or IC50 values, and a dataset selector to show only the experiments in the desired dataset. Hovering over each bar shows the name of the cell line, and the AAC/IC50 of the experiment.</p>
            <div className="center"><img className="small" src={drugAACCell}/></div>
            <h7>AAC (Tissues)</h7>
            <p>AAC (Tissues) page shows a box plot displaying the sensitivity range of the tissues tested with the compound across all datasets. Each dot represents a cell line and similarly there is a profile selector to show the AAC/IC50 values, and a dataset selector to show only the experiments in the desired dataset. Hovering over each box shows the tissue name, minimum, maximum, sample median, and the first and third quartiles of the AAC/IC50 of the experiment for that tissue.</p>
            <div className="center"><img className="small" src={drugAACTissue}/></div>
            <h7>Cell Lines Summary</h7>
            <p>Cell Lines Summary page includes a table of cells and tissues on which that compound has been tested, with the studies in which the cell - compound combination can be found and the total number of experiments across all datasets. Clicking on each cell line, tissue or dataset name will take you to the corresponding page.</p>
            <div className="center"><img className="small" src={drugIndCellList}/></div>
            <h7>Tissues Summary</h7>
            <p>Tissues Summary page includes a table of tissue on which that compound has been tested, with the studies in which the compound - tissue combination can be found and the total number of experiments across all cell lines of the tissue type in all datasets. Similarly, clicking on tissue,  dataset names, and experiment numbers will take you to the corresponding page.</p>
            <div className="center"><img className="small" src={drugIndTissues}/></div>
            <h7>Molecular Features</h7>
            <p>Molecular Features page shows a table summarizing the top molecular features associated with the compound.</p>
            {/*<img width="600px" alt="compound indiv page- Molecular feature table" src={doseImg} title="Molecular feature"/>*/}
        </div>
    );
}
export default DocDrug;
