import React from 'react';
import tissueSearch from '../../../../images/DocumentationImages/tissueSearch.png';
import homeTissue from '../../../../images/DocumentationImages/homeTissue.PNG';
import pieChart from '../../../../images/DocumentationImages/pieChart.png';
import tissueList from '../../../../images/DocumentationImages/tissueList.png';
import tissueAnnotation from '../../../../images/DocumentationImages/tissueAnnotation.png';
import tissueBar from '../../../../images/DocumentationImages/tissueIndBar.png';
import tissueCellList from '../../../../images/DocumentationImages/tissueIndCellList.png';
import tissueDrugList from '../../../../images/DocumentationImages/tissueIndDrugList.png';

/**
 * Shows the Tissue description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocTissue/>
 * )
 */
const DocTissue = () => {
    return(
        <div className='documentation'>
            <p>Each tissue type included in PharmacoDB has a webpage associated with it. These pages can be accessed by searching for a tissue through the search bar, or by clicking on the tissues link at the bottom of the homepage or from the Data drop down menu on the top right side of the homepage.</p>
            <img width="650px"  alt="Searching Lung on search bar" src={tissueSearch} title="Searching tissues" />
            <p>Or</p>
            <img width="650px"  alt="Searching Lung on search bar" src={homeTissue} title="Tissues" />
            <p>Tissues link takes you to a page starting with a pie chart representing the relative percentage of cell lines per tissue in PharmacoDB. Hovering over each color on the pie chart shows the name of the tissue associated with that color.</p>
            <img width="650px"  alt="Relative Percentage of cell lines per tissue" src={pieChart} title="Relative percentage" />
            <p>The page also includes a table that lists the names of all the tissues included in PharmacoDB. Clicking on each tissue name takes you to the webpage associated with that tissue.</p>
            <img width="650px" alt="Tissues list" src={tissueList} title="Tissues"/>
            <p>Each tissue page has a sidebar including Annotations, Bar Plot, Cell Line Summary, and Drug Summary.</p>
            <h7>Annotations</h7>
            <p>Annotations page displays information about the datasets which performed experiments on the query tissue type, with synonyms for that tissue within each dataset.
            </p>
            <img width="650px" alt="Tissue annotation" src={tissueAnnotation} title="Annotations"/><br/>
            <h7>Bar Plots</h7>
            <p>Bar Plots page includes plots comparing the number of cell lines and drugs tested on cell lines of the tissue type in each PharmacoDB dataset.</p>
            <img width="650px" alt="Tissue bar plot" src={tissueBar} title=""/><br/>
            <h7>Cell Line Summary</h7>
            <p>Cell Line Summary page includes a table of cell lines of the tissue type included in PharmacoDB. Clicking on each cell name takes you to a page corresponding to that cell line. You can also use the search bar above the table to search for the cell line for interest.</p>
            <img width="650px" alt="List of tested cell lines" src={tissueCellList} title="Cell lines"/><br/>
            <h7>Drug Summary</h7>
            <p>Drug Summary page includes a table of drugs tested on the tissue type, with the studies in which the drug - tissue combination can be found and the total number of experiments across all datasets. Clicking on each drug name or dataset name will take you to the corresponding page to that instance.</p>
            {/*<img width="650px" alt="List of tested cell lines" src={} title="Drugs"/><br/>*/}
            {/*need to add an screen shot from drug summary table on individual tissue page*/}
            {/*<img width="650px" alt="List of tested compounds" src={tissueDrugList} title="Tested compounds"/>*/}
        </div>
    );
}
export default DocTissue;
