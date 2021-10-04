import React from 'react';
import cellSearch from '../../../../images/DocumentationImages/cellSearch.png';
import intersectionSearch from '../../../../images/DocumentationImages/datasetsIntersection.png';
import cellDrugSearch from '../../../../images/DocumentationImages/cellDrugSearch.png';
import drugTissueSearch from '../../../../images/DocumentationImages/drugTissueSearch.png';
import homeNav from '../../../../images/DocumentationImages/homeNav.png';

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
            <p>The search bar takes several distinct types of queries. The simplest is to query for a single specific entity in the database. One can use the search to query for a specific cell line (e.g. MCF-7), compound (e.g. 17-AAG), tissue (e.g. breast) or dataset (e.g. CTRPv2). This query would then take you to the corresponding page for that instance. It is feasible to search for the synonyms of a compound name or cell line names as long as they are included in one of the PharmacoDB datasets.</p>
            <p>The search bar also allows the user to specify a data type (e.g. cell line, compound, dataset), where it would take the user to a page listing all instances of that data type in the database.</p>
            {/*<img width="650px" alt="Searching cell line data" src={logo} title="Searching cell"/>*/}
            <p>Queries consisting of the names of multiple datasets, with a space between dataset names, are also allowed. This query will link the user to a page describing the intersection between the datasets, with tables listing the common cell lines, compounds and tissue types.</p>
            <div className="center"><img className="bar" src={intersectionSearch}/></div>
            <p>Queries consisting of combinations of the name of a compound with cell line or tissue, delimited by a space, will direct to a page plotting all the available compound dose response curves for that combination across all datasets in PharmacoDB.</p>
            <h6>cell line vs. compound/ compound vs. cell line</h6>
            <div className="center"><img className="bar" src={cellDrugSearch}/></div>
            <h6>compound vs. tissue/ tissue vs. compound</h6>
            <div className="center"><img className="bar" src={drugTissueSearch}/></div>
            <p>Another main way of interacting with PharmacoDB is by clicking on the data types provided at the bottom of the homepage. Data types are also accessible through the Data drop down menu on the top right side of the homepage.</p>
            <div className="center"><img className="bar" src={homeNav}/></div>
        </div>
    );
}
export default DocSearch;
