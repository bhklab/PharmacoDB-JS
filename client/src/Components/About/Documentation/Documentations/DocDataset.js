import React from 'react';
import datasetSearch from '../../../../images/DocumentationImages/datasetSearch.png';
import homeDataset from '../../../../images/DocumentationImages/homeDataset.PNG';
import upsetPlot from '../../../../images/DocumentationImages/upsetPlot.png';
import datasetList from '../../../../images/DocumentationImages/datasetList.png';
import individualDataset from '../../../../images/DocumentationImages/datasetInd.png';
import datasetResource from '../../../../images/DocumentationImages/datasetResource.png';
import dataTypes from '../../../../images/DocumentationImages/datasetDType.png';
import datasetBarPlotA from '../../../../images/DocumentationImages/datasetIndBarA.png';
import datasetBarPlotB from '../../../../images/DocumentationImages/datasetIndBarB.png';
import datasetCellList from '../../../../images/DocumentationImages/DatasetCellList.png';
import datasetDrugList from '../../../../images/DocumentationImages/datasetDrugList.png';

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
            <p>
                Each study included in PharmacoDB has a dataset page associated with it. These pages can be accessed either by searching for a study through the search bar, or from the datasets page accessible through clicking on the datasets link at the bottom of the homepage.
            </p>
            <img width="650px"  alt="Searching CCLE on search bar" src={datasetSearch} title="Searching dataset" />
            <p>
                Or
            </p>
            <img width="650px"  alt="Highlighted dataset on navigation bar" src={homeDataset} title="Home page tool bar" />
            <p>
                Datasets icon on the front page directs you to a page starting with a bar graph showing the number of cell lines per dataset as well as the number of common cell lines between any given datasets.
            </p>
            <img width="650px"  alt="Upset plot showing cell lines tested on different datasets" src={upsetPlot} title="Datasets Upset plot" />
            <p>
                Datasets page concludes with a table listing all the available datasets in PharmacoDB. Clicking on each dataset name takes you to the webpage corresponding to that dataset.
            </p>
            <img width="100%" alt="List of datasets" src={datasetList} title="List of datasets"/>
            <p>
                Each dataset page has a sidebar including Dataset Information, Resources, Data types, Bar Plots, Summary Cell Lines, and Summary Compounds.
            </p>
            <p>
                Dataset Information page displays information about the study which collected the pharmacological data, the publications associated with the dataset, and the name of the PharmacoSet object from the PharmacoGX R package associated with the data.
            </p>
            <h6>Example: CCLE dataset</h6>
            <img width="100%" alt="Intial view of individual dataset page" src={individualDataset} title="Dataset page"/>
            <p>
                Resources page includes links to resources which provide access to the original data.
            </p>
            <img width="280px" alt="Resource section of individual dataset page" src={datasetResource} title="Dataset resources"/>
            <p>
                Data types page includes a table of all the available pharmacological and molecular data, with annotations about the assays used to collect them.
            </p>
            <img width="600px" alt="Data type table" src={dataTypes} title="Data types"/>
            <p>
                Bar Plots page includes plots comparing the number of drugs, tissues, cell lines and experiments in the chosen dataset to others in PharmacoDB. The dataset being displayed is selected in Red.
            </p>
            <img width="600px" alt="Bar plots" src={datasetBarPlotA} title="Tests accross datasets"/>
            <img width="600px" alt="Bar plots" src={datasetBarPlotB} title="Tests accross datasets"/>
            <p>
                Summary Cell Lines page represents a table including a list of all the cell lines that were tested in this dataset. Each entry in the table links to the cell line page for that entry. They are also searchable using the search bar at the top of the table..
            </p>
            <img width="600px" alt="List of cell lines tested in dataset" src={datasetCellList} title="Cell lines"/>
            <p>
                Summary Compounds page represents a table including a list of all the drugs that were tested in this dataset. Clicking on each entry in the table directs you to the compound page for that entry. Similarly, the drugs are also searchable using the search bar at the top of the table.
            </p>
            <img width="600px" alt="List of compounds tested in dataset" src={datasetDrugList} title="Compounds"/>
        </div>
    );
}
export default DocDataset;
