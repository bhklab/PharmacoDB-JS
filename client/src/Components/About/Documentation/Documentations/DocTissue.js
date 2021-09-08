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

const Tissue = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Tissues</h2>
                <div>
                    <p>
                        Each tissue type included in PharmacoDB has a webpage associated with it. These pages can be
                        accessed by searching for a tissue type through the search bar.
                    </p>
                    <p>
                        Each tissue type page starts with a card which displays information about the datasets which
                        performed experiments on that tissue type, with synonyms for that tissue within each dataset.
                    </p>
                    <p>
                        The page includes plots comparing the number of drugs tested on and cell lines of that tissue
                        type in each PharmacoDB dataset.
                    </p>
                    <p>
                        The page includes a table of cell lines of that tissue type included in PharmacoDB. Clicking on
                        each cell name takes you to a page for that cell line, with information of about the datasets it
                        is found in and the drugs tested with that cell line.
                    </p>
                    <p>
                        The page also includes a table of drugs tested on that tissue type, with the studies in which
                        the drug - tissue combination can be found and the total number of experiments across all datasets.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default Tissue;
