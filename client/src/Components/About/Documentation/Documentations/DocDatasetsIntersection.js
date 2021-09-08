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

const DatasetsIntersection = () => {
    return(
        <div className='documentation'>
            <DocHeader>
                <h2>Datasets Intersection</h2>
                <div>
                    <p>
                        The intersection of datsets included in PharmacoDB can be queried by typing the names of the
                        datasets to be compared into the search bar, separated by spaces.
                    </p>
                    <p>
                        The page contains diagrams of the common drugs, tissues, and cell lines in the queried datasets.
                    </p>
                    <p>
                        An intersection of 3 datasets or less is shown in a venn diagram. Each section is clickable to
                        view a table of elements.
                    </p>
                    <p>
                        An intersection of 4 datasets or more is shown in an UpSet plot. Each intersection
                        (bar or circles) is clickable to view a table of elements. The bar is hoverable to view the number of elements contained in the intersection.
                    </p>
                </div>
            </DocHeader>
        </div>
    );
}
export default DatasetsIntersection;
