import React from 'react';
import cellSearch from '../../../../images/DocumentationImages/cellSearch.png';
import homeCell from '../../../../images/DocumentationImages/homeCellLines.png';
import pieChart from '../../../../images/DocumentationImages/pieChart.png';
import cellSummaryList from '../../../../images/DocumentationImages/cellSummaryList.png';
import cellIndBar from '../../../../images/DocumentationImages/cellIndBar.png';
import cellInd from '../../../../images/DocumentationImages/cellline_hela_summary.png';
import cellAAC from '../../../../images/DocumentationImages/cellline_hela_aac.png';
import cellDrugList from '../../../../images/DocumentationImages/cellline_hela_compsummary.png';
import cellMolProf from '../../../../images/DocumentationImages/cellline_hela_molprof.png';

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
            <p>Each cell line included in PharmacoDB has a cell line page associated with it. These pages can be accessed by searching for a cell line through the search bar, by clicking on the cell lines link at the bottom of the homepage or from the Data drop down menu on the top right side of the homepage.</p>
            <div className="center"><img className="bar" src={cellSearch}/></div>
            <div className="center"><p>Or</p></div>
            <div className="center"><img className="bar" src={homeCell}/></div>
            <p>Cell lines link directs you to a page starting with a pie chart representing the relative percentage of cell lines per tissue in PharmacoDB. Hovering over each color on the pie chart shows the name of the tissue associated with that color.</p>
            <div className="center"><img src={pieChart}/></div>
            <p>The page also includes a table that lists the names of all the cell lines included in PharmacoDB. Clicking on each cell line name takes you to the webpage associated with that cell line. Cell lines can also be searched using the search bar above the table.</p>
            <div className="center"><img src={cellSummaryList}/></div>
            <p>Each cell line page has a sidebar including Annotations, Bar Plot, AAC (Compounds), Compounds Summary, and Molecular Profiling.</p>
            <h7>Annotations</h7>
            <p>Annotations page displays information about the synonyms in each dataset that used the cell line of the query, the diseases it was used to model, and its cellosaurus name. Clicking on a dataset name, disease name or cellosaurus link will direct you to the corresponding page for that instance.</p>
            <div className="center"><img className="small" src={cellInd}/></div>
            <h7>Bar Plot</h7>
            <p>Bar Plot page shows a plot comparing the total number of compounds tested on the cell line in each PharmacoDB dataset. Hovering over each bar shows the exact number of compounds.</p>
            <div className="center"><img className="small" src={cellIndBar}/></div>
            <h7>AAC (Compounds)</h7>
            <p>AAC (Compounds) page shows a waterfall plot displaying the most and least sensitive compounds tested with the cell line. There is a profile selector to show the AAC or IC50 values, and a dataset selector to show only the experiments in the desired dataset. Hovering over each bar shows the name of the compound, and the AAC/IC50 of the experiment. Also, it is possible to zoom out (using the zoom switch) to view more compounds.</p>
            <div className="center"><img className="small" src={cellAAC}/></div>
            <h7>Compounds Summary</h7>
            <p>Compounds Summary page has a table of all the compounds tested on the cell line in each dataset, with the list of datasets where this combination was tested and the total number of experiments across all studies. Clicking on a compound name or dataset name will take you to the corresponding page.</p>
            <div className="center"><img className="small" src={cellSummaryList}/></div>
            <h7>Molecular Profiling</h7>
            <p>Molecular Profiling page shows a table summarizing the available molecular profiling in PharmacoGx for the cell line.</p>
            <div className="center"><img className="small" src={cellMolProf}/></div>
        </div>
    );
}
export default DocCell;
