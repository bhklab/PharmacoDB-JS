import React, {useState} from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

/**
 * Shows the API description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocAPI/>
 * )
 */
const DocAPI = () => {
    return(
        <div className='documentation'>
            <p>
                This section contains some content regarding API on PharmacoDB web-app, including images and descriptions.
            </p>
            <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="sample image"/>
        </div>
    );
}
export default DocAPI;
