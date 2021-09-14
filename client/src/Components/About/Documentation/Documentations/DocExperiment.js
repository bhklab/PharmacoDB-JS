import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png'
import homeExperiment from '../../../../images/DocumentationImages/homeExperiment.PNG';
import experimentBarPlot from '../../../../images/DocumentationImages/experimentsBar.png';

/**
 * Shows the Experiment description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocExperiment/>
 * )
 */
const DocExperiment = () => {
    return(
        <div className='documentation'>
            <div>
                <p>
                    Experiments webpage is accessible from the experiments link at the bottom of the homepage.
                </p>
                <img height="auto" width="650px"  alt="Highlighted experiment on navigation bar" className="dose-img" src={homeExperiment} title="Experiments icon"/>
                <p>
                    The webpage provides bar plots displaying the average number of experiments per cell line or compound in each PharmacoDB dataset.
                </p>
                <img height="auto" width="650px"  alt="Experiments per dataset bar plot" className="dose-img" src={experimentBarPlot} title="Experiments per dataset"/>
            </div>
        </div>
    );
}
export default DocExperiment;
