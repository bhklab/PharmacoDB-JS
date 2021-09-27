import React from 'react';
import tissueSearch from '../../../../images/DocumentationImages/tissueSearch.png';
import homeTissue from '../../../../images/DocumentationImages/homeTissue.PNG';
import pieChart from '../../../../images/DocumentationImages/pieChart.png';
import tissueList from '../../../../images/DocumentationImages/tissueList.png';
import tissueAnnotation from '../../../../images/DocumentationImages/bone_annot.png';
import tissueBar from '../../../../images/DocumentationImages/tissueIndBar.png';
import tissueCellList from '../../../../images/DocumentationImages/tissueCellList.png';
import tissueDrugList from '../../../../images/DocumentationImages/tissueDrugSummary.png';

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
            <div className="center"><img src={tissueSearch}/></div>
            <div className="center"><p>Or</p></div>
            <div className="center"><img src={homeTissue}/></div>
            <p>Tissues link takes you to a page starting with a pie chart representing the relative percentage of cell lines per tissue in PharmacoDB. Hovering over each color on the pie chart shows the name of the tissue associated with that color.</p>
            <div className="center"><img src={pieChart}/></div>
            <p>The page also includes a table that lists the names of all the tissues included in PharmacoDB. Clicking on each tissue name takes you to the webpage associated with that tissue.</p>
            <div className="center"><img src={tissueList}/></div>
            <p>Each tissue page has a sidebar including Annotations, Bar Plot, Cell Line Summary, and Compound Summary.</p>
            <h7>Annotations</h7>
            <p>Annotations page displays information about the datasets which performed experiments on the query tissue type, with synonyms for that tissue within each dataset. For demonstration, the tissue “Bone” is selected here.</p>
            <div className="center"><img className="small" src={tissueAnnotation}/></div>
            <h7>Bar Plots</h7>
            <p>Bar Plots page includes plots comparing the number of cell lines and compounds tested on cell lines of the tissue type in each PharmacoDB dataset.</p>
            <div className="center"><img className="small" src={tissueBar}/></div>
            <h7>Cell Lines Summary</h7>
            <p>Cell Lines Summary page includes a table of cell lines of the tissue type included in PharmacoDB. Clicking on each cell name takes you to a page corresponding to that cell line. You can also use the search bar above the table to search for the cell line for interest.</p>
            <div className="center"><img className="small" src={tissueCellList}/></div>
            <h7>Compounds Summary</h7>
            <p>Compounds Summary page includes a table of compounds tested on the tissue type, with the studies in which the compound - tissue combination can be found and the total number of experiments across all datasets. Clicking on each compound name or dataset name will take you to the corresponding page to that instance.</p>
            <div className="center"><img className="small" src={tissueDrugList}/><br/></div>
        </div>
    );
}
export default DocTissue;
