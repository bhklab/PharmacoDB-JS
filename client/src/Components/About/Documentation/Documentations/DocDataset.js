import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

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
            <div>
                <p>
                    Each study included in PharmacoDB has a dataset page associated with it. These pages can be accessed
                    either by searching for a study through the search bar, or from the datasets page accessible through
                    clicking on the datasets link at the bottom of the homepage.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="CCLE on search bar or home page bottom toolbar"/>
                <p>
                    Datasets link directs you to a page starting with a bar graph showing the number of cell lines per
                    each dataset as well as the number of common cell lines between any given groups of datasets. a table
                    listing the names of all the available datasets in PharmacoDB .
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Dataset page upset plot"/>
                <p>
                    Datasets page concludes with a table listing all the available datasets in PharmacoDB. Clicking on
                    each dataset name takes you to the webpage corresponding to that dataset.
                </p>
                <img height="50" alt="dose-response curves" className="dose-img" src={doseImg} title="Dataset page dataset list table"/>
                <p>
                    Each dataset page has a sidebar including Dataset Information, Resources, Data types, Bar Plots,
                    Summary Cell Lines, and Summary Compounds.
                </p>
                <p>
                    Dataset Information page displays information about the study which collected the pharmacological
                    data, the publications associated with the dataset, and the name of the PharmacoSet object from the
                    PharmacoGX R package associated with the data.
                </p>
                <h4>Example: CCLE dataset</h4>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Individual dataset page initial veiw"/>
                <p>
                    Resources page includes links to resources which provide access to the original data.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Individual dataset page- resources"/>
                <p>
                    Data types page includes a table of all the available pharmacological and molecular data, with
                    annotations about the assays used to collect them.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Individual dataset page- data types"/>
                <p>
                    Bar Plots page includes plots comparing the number of drugs, tissues, cell lines and experiments in
                    the chosen dataset to others in PharmacoDB. The dataset being displayed is selected in Red.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Individual dataset page- bar plots"/>
                <p>
                    Summary Cell Lines page represents a table including a list of all the cell lines that were tested
                    in this dataset. Each entry in the table links to the cell line page for that entry. They are also
                    searchable using the search bar at the top of the table.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Individual dataset page- summary cell"/>
                <p>
                    Summary Compounds page represents a table including a list of all the drugs that were tested in this
                    dataset. Clicking on each entry in the table directs you to the compound page for that entry.
                    Similarly, the drugs are also searchable using the search bar at the top of the table.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Individual dataset page- summary compound"/>
            </div>
        </div>
    );
}
export default DocDataset;
