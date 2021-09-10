import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png'

const Tissue = () => {
    return(
        <div className='documentation'>
            <div>
                <p>
                    Each tissue type included in PharmacoDB has a webpage associated with it. These pages can be accessed
                    either by searching for a tissue through the search bar, or by clicking on the tissues link at the
                    bottom of the homepage.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Lung on search bar or homepage toolbar"/>
                <p>
                    Tissues link takes you to a page starting with a pie chart representing the relative percentage of
                    cell lines per tissue in PharmacoDB. Hovering over each color on the pie chart shows the name of the
                    tissue associated with that color.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Pie chart"/>
                <p>
                    The page also includes a table that lists the names of all the tissues included in PharmacoDB.
                    Clicking on each tissue name takes you to the webpage associated with that tissue.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="List of Tissues on tissue summary page"/>
                <p>
                    Each tissue page has a sidebar including Annotations, Bar Plot, Cell Line Summary, and Drug Summary.
                </p>
                <p>
                    Annotations page displays information about the datasets which performed experiments on the query
                    tissue type, with synonyms for that tissue within each dataset. (the tabel seems to have wrong info,
                    to be updated)
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Tissue annotations table"/>
                <p>
                    Bar Plot page includes plots comparing the number of drugs tested on cell lines of the tissue type
                    in each PharmacoDB dataset.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Bar plot"/>
                <p>
                    Cell Line Summary page includes a table of cell lines of the tissue type included in PharmacoDB.
                    Clicking on each cell name takes you to a page corresponding to that cell line. You can also use the
                    search bar above the table to search for the cell line for interest.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Cell lines of lung tissue type table"/>
                <p>
                    Drug Summary page includes a table of drugs tested on the tissue type, with the studies in which the
                    drug - tissue combination can be found and the total number of experiments across all datasets.
                    Clicking on each drug name or dataset name will take you to the corresponding page to that instance.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Drug summary table"/>
            </div>
        </div>
    );
}
export default Tissue;
