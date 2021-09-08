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

const Drug = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Drugs</h2>
                <div>
                    <p>
                        Each drug included in PharmacoDB has a webpage associated with it. These pages can be accessed
                        by searching for a drug type through the search bar.
                    </p>
                    <p>
                        Each drug page starts with a card which displays information about the datasets which performed
                        experiments with that drug as well as the name each gave to it.
                    </p>
                    <p>
                        There are bar plots comparing the number of cells and tissues tested on with that drug in each
                        PharmacoDB dataset.
                    </p>
                    <p>
                        There is a waterfall plot displaying the most and least sensitive cell lines tested with the drug.
                        There is a switch to show the AAC/pIC50 (logIC50) values, and a dataset selector to show only the
                        experiments in the desired dataset. Hovering over each bar shows the synonyms of the cell line,
                        and the AAC/pIC50 of the experiment.
                    </p>
                    <p>
                        There is also a box plot displaying the tissues tested with the drug across all datasets. Each
                        dot represents a cell line, and the boxes are sorted increasing. Similarly, there is a switch to
                        show AAC/pIC50 values.
                    </p>
                    <p>
                        The page also includes a table of cells on which that drug has been tested, with the studies in
                        which the cell - drug combination can be found and the total number of experiments across all
                        datasets.
                    </p>
                    <p>
                        The page also includes a table of tissue on which that drug has been tested, with the studies in
                        which the drug - tissue combination can be found and the total number of experiments across all
                        cell lines of the tissue type in all datasets.
                    </p>
                    <p>
                        Lastly, there is a table summarizing the top molecular features associated with the drug.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default Drug;
