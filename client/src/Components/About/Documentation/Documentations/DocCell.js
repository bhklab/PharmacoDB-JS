import React from 'react';
import cellSearch from '../../../../images/DocumentationImages/cellSearch.png';
import homeCell from '../../../../images/DocumentationImages/homeCell.PNG';
import pieChart from '../../../../images/DocumentationImages/pieChart.png';
import cellSummaryList from '../../../../images/DocumentationImages/cellSummaryList.png';
import cellIndBar from '../../../../images/DocumentationImages/cellIndBar.png';
import cellAAC from '../../../../images/DocumentationImages/cellAAC.png';
import cellDrugList from '../../../../images/DocumentationImages/cellIndDrugList.png';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the Cell line description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocCell/>
 * )
 */
const DocCell = () => {
    return(
        <div className='documentation'>
            <p>
                Each cell line included in PharmacoDB has a cell line page associated with it. These pages can be accessed either by searching for a cell line through the search bar, or by clicking on the cell- lines link at the bottom of the homepage.
            </p>
            <img width="650px" alt="Searching MCF-7 on search bar" src={cellSearch} title="Searching cell"/>
            <p>
                Or
            </p>
            <img width="650px" alt="Highlighted cell-line on navigation bar" src={homeCell} title="Cell line"/>
            <p>
                Cell lines link directs you to a page starting with a pie chart representing the relative percentage of cell lines per tissue in PharmacoDB. Hovering over each color on the pie chart shows the name of the tissue associated with that color.
            </p>
            <img width="650px" alt="Cell lines per tissue pie chart"  src={pieChart} title="Relative percentage"/>
            <p>
                The page also includes a table that lists the names of all the cell lines included in PharmacoDB. Clicking on each cell line name takes you to the webpage associated with that cell line. Cell lines can also be searched using the search bar above the table.
            </p>
            <img width="650px" alt="List of cell lines"  src={cellSummaryList} title="Cell lines"/>
            <p>
                Each cell line page has a sidebar including Cell Line data, Bar Plot, AAC (Compounds), Drugs Summary, and Molecular Profiling.
            </p>
            <p>
                Cell Line Data page displays information about the synonyms in each dataset that used the cell line of query, the diseases it was used to model, and its Cellosaurus name. Clicking on a dataset name, disease name or Cellosaurus link will direct you to the corresponding page for that instance.
            </p>
            <img width="650px" alt="not finalized"  src={doseImg} title=" Cell Line Data"/>
            <p>
                Bar Plot page shows a plot comparing the total number of drugs tested on the cell line in each PharmacoDB dataset.
            </p>
            <img width="650px" alt="individual cell line - Compounds tested"  src={cellIndBar} title="Tested compounds"/>
            <p>
                AAC (Compounds) page shows a waterfall plot displaying the most and least sensitive drugs tested with the cell line. There is a profile selector to show the AAC or IC50 values, and a dataset selector to show only the experiments in the desired dataset. Hovering over each bar shows the name of the drug, and the AAC/IC50 of the experiment.
            </p>
            <img width="650px" alt="individual cell line - AAC plot"  src={cellAAC} title="AAC plot"/>
            <p>
                Drugs Summary page has a table of all the drugs tested on the cell line in each dataset, with the list of datasets where this combination was tested and the total number of experiments across all studies. Clicking on a drug name or dataset name will take you to the corresponding page.
            </p>
            <img width="650px" alt="individual cell line - Compound tested with Hela "  src={cellSummaryList} title="Compound tested with Hela "/>
            <p>
                Molecular Profiling page shows a table summarizing the available molecular profiling in PharmacoGx for the cell line.
            </p>
            <img width="650px" alt="individual cell line -  Molecular Profiling"  src={doseImg} title="Molecular Profiling"/>
        </div>
    );
}
export default DocCell;
