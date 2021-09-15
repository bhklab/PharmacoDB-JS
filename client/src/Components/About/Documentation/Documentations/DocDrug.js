import React from 'react';
import homeCompound from '../../../../images/DocumentationImages/homeCompound.PNG';
import drugSummaryBar from '../../../../images/DocumentationImages/drugSummaryBar.png';
import drugIndBar from '../../../../images/DocumentationImages/drugIndBar.png';
import drugAACCell from '../../../../images/DocumentationImages/drugAACCell.png';
import drugAACTissue from '../../../../images/DocumentationImages/drugAACTissue.png';
import drugIndCellList from '../../../../images/DocumentationImages/drugIndCells.png';
import drugIndTissues from '../../../../images/DocumentationImages/drugIndTissues.png';
import doseImg from '../../../../images/pharmacodb-logo.png';

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
                <p>
                    Each drug included in PharmacoDB has a  webpage page associated with it. These pages can be accessed either by searching for a drug through the search bar, or by clicking on the compounds link at the bottom of the homepage.
                </p>
                <img width="600px" alt="Paclitaxel on search bar or home page bottom toolbar" src={doseImg} title="Searching compound"/>
                <p>
                    Or
                </p>
                <img width="600px" alt="Highlighted compound on navigation bar" src={homeCompound} title="Compound"/>
                <p>
                    Compounds link directs you to a page starting with a bar plot showing the number of drugs tested in each dataset included in PharmacoDB. Hovering over each bar shows the exact number of drugs.
                </p>
                <img width="600px" alt="Compounds tested in each data set" src={drugSummaryBar} title="Tested compounds"/>
                <p>
                    The page also contains a table showing the name, SMILES, InChIKeys, PubChem name and FDA status of all the drugs included in the PharmacoDB. Clicking on each drug name will take you to the corresponding drug page.
                </p>
                <img width="600px" alt="compound summary page- list of compounds" src={doseImg} title="Compounds"/>
                <p>
                    Each drug page has a sidebar including Synonyms and IDS, Annotated Targets, Bar Plots, AAC (Cell Lines), AAC (Tissues), Cell Line Summary, Tissue Summary, and Molecular Features.
                </p>
                <p>
                    Synonyms and IDS page displays information about the datasets which performed experiments with the drug of query as well as the name each gave to it. External identifiers such as SMILES, InChiKey and PubChem ID are also available on this page. Clicking on PubChem ID will direct you to the corresponding page on PubChem.
                </p>
                <p>
                    Annotated Targets page shows a table which includes the name of the gene targets associated with the drug, dataset in which the gene can be found, tissue type of the cell expressing the gene, reported statistical measure, standard coefficient, and p-value of the Nominal ANOVA test.
                </p>
                <img width="600px" alt="compound indiv page- Annotated targets" src={doseImg} title="Annotated targets"/>
                <p>
                    Bar Plots page shows bar plots comparing the number of cells and tissues tested on with that drug in each PharmacoDB dataset. Hovering over each bar shows the exact number of cells/tissues for that dataset.
                </p>
                <img width="600px" alt="Bar plot of Paclitaxel associated tests" src={drugIndBar} title="Tests"/>
                <p>
                    AAC (Cell Lines) page shows a waterfall plot displaying the most and least sensitive cell lines tested with the drug. There is a profile selector to show the AAC or IC50 values, and a dataset selector to show only the experiments in the desired dataset. Hovering over each bar shows the name of the cell line, and the AAC/IC50 of the experiment.
                </p>
                <img width="600px" alt="Compound indiv page- AAC(cell)s" src={drugAACCell} title="AAC(cell)"/>
                <p>
                    AAC (Tissues) page shows a box plot displaying the sensitivity range of the tissues tested with the drug across all datasets. Each dot represents a cell line and similarly there is a profile selector to show the AAC/IC50 values, and a dataset selector to show only the experiments in the desired dataset. Hovering over each box shows the tissue name, minimum, maximum, sample median, and the first and third quartiles of the AAC/IC50 of the experiment for that tissue.
                </p>
                <img width="600px" alt="Compound indiv page- AAC(Tissue)" src={drugAACTissue} title="AAC(Tissue)"/>
                <p>
                    Cell Line Summary page includes a table of cells and tissues on which that drug has been tested, with the studies in which the cell - drug combination can be found and the total number of experiments across all datasets. Clicking on each cell line, tissue or dataset name will take you to the corresponding page.
                </p>
                <img width="600px" alt="Compound indiv page- cell line summary table" src={drugIndCellList} title="Cell lines"/>
                <p>
                    Tissue Summary page includes a table of tissue on which that drug has been tested, with the studies in which the drug - tissue combination can be found and the total number of experiments across all cell lines of the tissue type in all datasets. Similarly, clicking on tissue or dataset name will take you to the corresponding page.
                </p>
                <img width="600px" alt="Compound indiv page- tissue summary table" src={drugIndTissues} title="Tissues"/>
                <p>
                    Molecular Features page shows a table summarizing the top molecular features associated with the drug.
                </p>
                <img width="600px" alt="compound indiv page- Molecular feature table" src={doseImg} title="Molecular feature"/>
        </div>
    );
}
export default DocDrug;
