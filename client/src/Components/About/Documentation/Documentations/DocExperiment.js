import React from 'react';
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
                <img  width="650px"  alt="Highlighted experiment on navigation bar"  src={homeExperiment} title="Experiments"/>
                <p>
                    The webpage provides bar plots displaying the average number of experiments per cell line or compound in each PharmacoDB dataset.
                </p>
                <img  width="650px"  alt="Experiments per dataset bar plot"  src={experimentBarPlot} title="Experiments per dataset"/>
            </div>
        </div>
    );
}
export default DocExperiment;
