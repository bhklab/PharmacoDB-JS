import React from 'react';
import cellSearch from '../../../../images/DocumentationImages/cellSearch.png';
import intersectionSearch from '../../../../images/DocumentationImages/intersectionSearch.png';
import cellDrugSearch from '../../../../images/DocumentationImages/cellDrugSearch.png';
import drugTissueSearch from '../../../../images/DocumentationImages/drugTissue.png';
import homeNav from '../../../../images/DocumentationImages/homeNav.png';
import logo from '../../../../images/pharmacodb-logo-dark.png'

/**
 * Shows the Search description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocSearch/>
 * )
 */
const DocSearch = () => {
    return(
        <div className='documentation'>
            <p>The main way to interact with PharmacoDB is through its Search interface. The search bar, found on the homepage of the website, allows the user to query all the data contained in the database, and functions as the main navigation tool around the web app.</p>
            <p>The Search bar takes several distinct types of queries. The simplest is to query for a single specific entity in the database. One can use the search to query for a specific cell (e.g. MCF-7), drug (e.g. 17-AAG), tissue (e.g. breast) or dataset (e.g. CTRPv2). This query would then take you to the corresponding page for that instance. It is feasible to search for the synonyms of a drug name or cell names as long as they are included in one of the PharmacoDB datasets.</p>
            <p>The search bar also allows the user to specify a data type (e.g. cell, drug, dataset), where it would take the user to a page listing all instances of that data type in the database.</p>
            <img width="650px" alt="Searching cell line data" src={logo} title="Searching cell"/>
            <p>Queries consisting of the names of multiple datasets, with a space between dataset names, are also allowed. This query will link the user to a page describing the intersection between the datasets, with tables listing the common cells, drugs and tissue types.</p>
            <img width="650px"  alt="Searching CCLE, NCI60, and gCSI" src={intersectionSearch} title="Searching multiple datasets" />
            <p>Queries consisting of combinations of the name of a drug with cell line or tissue, delimited by a space, will direct to a page plotting all the available drug dose response curves for that combination across all datasets in PharmacoDB.</p>
            <h6>Cell line vs. Drug/ Drug vs. Cell line</h6>
            <img width="650px" alt="Searching cell line vs. drug" src={cellDrugSearch} title="Searching cell line vs. Drug"/>
            <h6>Drug vs. Tissue/ Tissue vs. Drug</h6>
            <img width="650px" alt="Searching tissue vs. drug" src={drugTissueSearch} title="Searching Drug vs. Tissue"/>
            <p>Another main way of interacting with PharmacoDB is by clicking on the data types provided at the bottom of the homepage. Data types are also accessible through the Data drop down menu on the top right side of the homepage.</p>
            <img width="800px" alt="home page navigation bar" src={homeNav} title="Home page tool bar"/>
        </div>
    );
}
export default DocSearch;
