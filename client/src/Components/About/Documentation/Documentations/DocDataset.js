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

const Dataset = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Datasets</h2>
                <div>
                    <p>
                        Each study included in PharmacoDB has a dataset page associated with it. These pages can be
                        accessed either by clicking on the datasets links at the bottom of the homepage, or by searching for a study through the search bar.
                    </p>
                    <p>
                        Each dataset page starts with a card which displays information about the study which collected
                        the pharmacological data, links to resources which provide access to the original data, the
                        publications associated with the dataset, and a list of all the available pharmacological and
                        molecular data, with annotations about the assays used to collect them.
                    </p>
                    <p>
                        The page includes plots comparing the number of drugs, tissues, cell lines and experiments in
                        the chosen dataset to others in PharmacoDB. The dataset being displayed is selected in Red.
                    </p>
                    <p>
                        Finally, the page concludes with tables of all the cells and drugs that were tested in this
                        dataset. These tables are sorted alphabetically, each entry in the table links to the cell or
                        drug page for that entry. They are also searchable using the search bar at the top of the table.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default Dataset;
