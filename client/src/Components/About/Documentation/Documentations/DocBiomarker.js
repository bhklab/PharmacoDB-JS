import React, {useState} from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the Biomarker description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocBiomarker/>
 * )
 */
const DocBiomarker = () => {
    return(
        <div className='documentation'>
            <p>
                This section contains some content about Biomarker page on PharmacoDB web-app including images and
                descriptions.
            </p>
            <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="sample image"/>
        </div>
    );
}
export default DocBiomarker;
