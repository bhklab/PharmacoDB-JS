import React from 'react';
import homeExperiment from '../../../../images/DocumentationImages/homeExperiment.PNG';
import experimentBarsPlot from '../../../../images/DocumentationImages/experimentsBars.png';

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
            <p>Experiments webpage is accessible from the experiments link at the bottom of the homepage or from the Data drop down menu on the top right side of the homepage.</p>
            <div className="center"><img src={homeExperiment}/></div>
            <p>The webpage provides bar plots displaying the average number of experiments per cell line or compound in each PharmacoDB dataset.</p>
            <div className="center"><img className="small" src={experimentBarsPlot}/></div>
        </div>
    );
}
export default DocExperiment;
