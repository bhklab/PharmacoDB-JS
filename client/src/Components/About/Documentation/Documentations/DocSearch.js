import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png'

const Search = () => {
    return(
        <div className='documentation'>
            <div>
                <p>
                    The main way to interact with PharmacoDB is through its search interface. The search bar, found on
                    the homepage of the website, allows the user to query all the data contained in the database, and
                    functions as the main navigation tool around the web app.
                </p>
                <p>
                    PharmacoDB's search bar takes several distinct types of queries. The simplest is to query for a
                    single specific entity in the database. One can use the search to query for a specific cell
                    (e.g. MCF-7), drug (e.g. 17-AAG), tissue (e.g. breast) or dataset (e.g. CTRPv2). This query would
                    then take you to the corresponding page for that instance.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="MCF-7 on seach bar"/>
                <p>
                    The search bar also allows the user to specify a data type (e.g. cell, drug, dataset),
                    where it would take the user to a page listing all instances of that data type in the database.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="screen shot of a data type" />
                <p>
                    Queries consisting of the names of multiple datasets, with a space between dataset names, are also
                    allowed. This query will link the user to a page describing the intersection between the datasets,
                    with tables listing the common cells, drugs and tissue types.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="CCLE NCI60 gcsi on search bar"/>
                <p>
                    Queries consisting of combinations of the name of a drug with cell line or tissue, delimited by a
                    space, will direct to a page plotting all the available drug dose response curves for that
                    combination across all datasets in PharmacoDB.
                </p>
                <h4>Drug vs. Cell line/ Cell line vs. Drug</h4>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="MCF-7 Paclitaxel on search bar"/>
                <h4>Drug vs. Tissue/ Tissue vs. Drug</h4>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Paclitaxel Breast on search bar"/>
                <p>
                    Another main way of interacting with PharmacoDB is by clicking on the data types provided at the
                    bottom of the homepage.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="home page bottom tool bar"/>
            </div>
        </div>
    );
}
export default Search;
