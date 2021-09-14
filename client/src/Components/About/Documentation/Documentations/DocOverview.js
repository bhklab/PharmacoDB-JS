import React, {useState} from 'react';

/**
 * Shows the Overview of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocOverview/>
 * )
 */
const DocOverview = () => {
    return(
        <div className='documentation'>
            <p>
                Welcome to PharmacoDB. This web-application is a valuable tool in maximizing the usefulness of pharmacogenomics datasets for comparing and assessing drug response phenotypes of cancer models.
            </p>
            <p>
                PharmacoDB integrates multiple cancer pharmacogenomics datasets profiling approved and investigational drugs across cell lines from diverse tissue types. The web-application enables users to efficiently navigate across datasets, view and compare drug dose-response data for a specific drug-cell line pair.
            </p>
        </div>
    );
}
export default DocOverview;
