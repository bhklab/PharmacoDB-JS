import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the Dataset Intersection description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocDatasetsIntersection/>
 * )
 */
const DocDatasetsIntersection = () => {
    return(
        <div className='documentation'>
            <p>The intersection of datasets included in PharmacoDB can be queried by typing the names of the datasets to be compared into the search bar, separated by spaces.</p>
            {/*<img width="650px" alt="Searching datasets" src={doseImg} title="Searching datsets"/>*/}
            <p>The page contains diagrams of the common drugs, tissues, and cell lines in the queried datasets.</p>
            <p>An intersection of 3 datasets or less is shown in a venn diagram. Each section is clickable to view a table of elements.</p>
            {/*<img width="650px" alt="Venn diagram" src={doseImg} title="venn diagram"/>*/}
            <p>An intersection of 4 datasets or more is shown in an UpSet plot. Each intersection (bar or circles) is clickable to view a table of elements. The bar is hoverable to view the number of elements contained in the intersection.</p>
            {/*<img width="650px" alt="Upset plot" src={doseImg} title="upset plot"/>*/}
        </div>
    );
}
export default DocDatasetsIntersection;
