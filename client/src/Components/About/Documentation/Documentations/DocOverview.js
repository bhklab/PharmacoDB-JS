import React, {useState} from 'react';
import  styled , { createGlobalStyle }from 'styled-components';
import logo from '../../../../images/DocumentationImages/pharmacodb-logo-capsule.png';

const OverviewStyles = styled.div`
    .documentation {
      width: 90%;
      min-height: 900px;
        background: linear-gradient(
            to right top,
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0.5)
            ),url(${logo});
        background-size: auto;
        background-position: center;
        background-repeat: no-repeat;
    }
`;


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
        <OverviewStyles>
            <div className='documentation'>
            <h2>Welcome to PharmacoDB!</h2><br/>
            <p>This web-application is a valuable tool in maximizing the usefulness of pharmacogenomics datasets for comparing and assessing drug response phenotypes of cancer models.</p>
            <p>PharmacoDB integrates multiple cancer pharmacogenomics datasets profiling approved and investigational drugs across cell lines from diverse tissue types. The web-application enables users to efficiently navigate across datasets, view and compare drug dose-response data for a specific drug-cell line pair.</p>
            </div>
        </OverviewStyles>
    );
}
export default DocOverview;
