import React from 'react';
import datasetSearch from '../../../../images/DocumentationImages/datasetSearch.png';
import homeDataset from '../../../../images/DocumentationImages/homeDataset.PNG';
import upsetPlot from '../../../../images/DocumentationImages/datasetUpsetPlot.png';
import datasetList from '../../../../images/DocumentationImages/datasetList.png';
import individualDataset from '../../../../images/DocumentationImages/datasetInd.png';
import datasetResource from '../../../../images/DocumentationImages/datasetResource.png';
import dataTypes from '../../../../images/DocumentationImages/datasetDType.png';
import datasetBarPlotA from '../../../../images/DocumentationImages/datasetIndBarA.png';
import datasetBarPlotB from '../../../../images/DocumentationImages/datasetIndBarB.png';
import datasetCellList from '../../../../images/DocumentationImages/DatasetCellList.png';
import datasetDrugList from '../../../../images/DocumentationImages/DatasetDrugList.png';

/**
 * Shows the Dataset description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocDataset/>
 * )
 */
const DocDataset = () => {
    return(
        <div className='documentation'>
            <p>Each study included in PharmacoDB has a dataset page associated with it. These pages can be accessed by searching for a study through the search bar, or from the datasets page accessible through clicking on the datasets link at the bottom of the homepage or from the Data drop down menu on the top right side of the homepage.</p>
            <div className="center"><img src={datasetSearch}/></div>
            <div className="center"><p>Or</p></div>
            <div className="center"><img src={homeDataset}/></div>
            <p>Datasets link on the front page directs you to a page starting with a bar graph showing the number of cell lines per dataset as well as the number of common cell lines between any given datasets. Using the selector you can choose to view this information for tissues or compounds across datasets.</p>
            <div className="center"><img src={upsetPlot}/></div>
            <p>Datasets page concludes with a table listing all the available datasets in PharmacoDB. Clicking on each dataset name takes you to the webpage corresponding to that dataset.</p>
            <div className="center"><img src={datasetList}/></div>
            <p>Each dataset page has a sidebar including Dataset Information, Resources, Data types, Bar Plots, Summary Cell Lines, and Summary Compounds.</p>
            <h7>Dataset Information</h7>
            <p>Dataset Information page displays information about the study which collected the pharmacological data, the publications associated with the dataset, the name of the PharmacoSet object from the PharmacoGX R package associated with the data, and the link to the dataset on ORCESTRA.</p>
            <h6>Example: CCLE dataset</h6>
            <div className="center"><img src={individualDataset}/></div>
            <h7>Resources</h7>
            <p>Resources page includes links to resources which provide access to the original data.</p>
            <div className="center"><img className="smaller" src={datasetResource}/></div>
            <h7>Data Types</h7>
            <p>Data types page includes a table of all the available pharmacological and molecular data in the dataset, with annotations about the assays used to collect them.</p>
            <div className="center"><img className="small" src={dataTypes}/></div>
            <h7>Bar Plots</h7>
            <p>Bar Plots page includes plots comparing the number of cell lines, tissues, compounds and experiments in the chosen dataset to others in PharmacoDB. The dataset being displayed is highlighted in Red.</p>
            <div className="center"><img className="small" src={datasetBarPlotA}/></div>
            <div className="center"><img className="small" src={datasetBarPlotB}/></div>
            <h7>Cell Lines Summary</h7>
            <p>Cell Lines Summary page represents a table including a list of all the cell lines that were tested in this dataset. Each entry in the table links to the cell line page for that entry. They are also searchable using the search bar at the top of the table..</p>
            <div className="center"><img className="small" src={datasetCellList}/></div>
            <h7>Compounds Summary</h7>
            <p>Compounds Summary page represents a table including a list of all the compounds that were tested in this dataset. Clicking on each entry in the table directs you to the compound page for that entry. Similarly, the compounds are also searchable using the search bar at the top of the table.</p>
            <div className="center"><img className="small" src={datasetDrugList}/></div>
        </div>
    );
}
export default DocDataset;
