import React from 'react';
import styled from "styled-components";

const DocHeader = styled.div`
    margin-top: 20px;
    .title {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 3px solid rgb(241, 144, 33);
    }
`;

const Search = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Search</h2>
                <div>
                    <p>
                        The main way to interact with PharmacoDB is through its search interface. The search bar, found
                        on the home page of the website, allows the user to query all the data contained in the database,
                        and functions as the main navigation tool around the web app.
                    </p>
                    <p>
                        PharmacoDB's search bar takes several distinct types of queries. The simplest is to query for a
                        single specific entity in the database. One can use the search to query for a specific cell
                        (e.g. MCF-7), drug (e.g. 17-AAG), tissue (e.g. breast) or dataset (e.g. CTRPv2). This query would
                        then take you to the corresponding page for that instance.
                    </p>
                    <p>
                        The search bar also allows the user to specify a data type (e.g. cell, drug, dataset), where it
                        would take the user to a page listing all instances of that data type in the database.
                    </p>
                    <p>
                        Queries consisting of the names of multiple datasets, with a space between dataset names, are
                        also allowed. This query will link the user to a page describing the intersection between the
                        datasets, with tables listing the common cells, drugs and tissue types.
                    </p>
                    <p>
                        Finally, entering the name of a cell line followed by a drug, or vice versa, also delimited by a
                        space, will direct to a page plotting all the available drug dose response curves for that
                        combination across all datasets in PharmacoDB.
                    </p>
                </div>
                <h2>Batch Query</h2>
                <div>
                    <p>
                        For queries involving multiple cell lines and compounds, users can access the drug sensitivity
                        data via the Batch Query page.
                    </p>
                    <p>
                        The batch query interface allows users to quickly cut and paste their list of cell lines and
                        compounds of interest.
                    </p>
                    <p>
                        After submission, a spreadsheet containing all the summary metrics for the drug dose-response
                        curves included in PharmacoDB will be available for download.
                    </p>
                    <p>
                        Further queries, including comparisons of more data types, and more visualizations of the data
                        provided are in active development, so be sure to check back with the documentation!
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default Search;
