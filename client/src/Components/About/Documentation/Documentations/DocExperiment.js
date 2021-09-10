import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png'

const Experiment = () => {
    return(
        <div className='documentation'>
            <div>
                <p>
                    Experiments webpage is accessible from the experiments link at the bottom of the homepage.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="Homepage bottom toolbar"/>
                <p>
                    The webpage provides bar plots displaying the average number of experiments per cell line or
                    compound in each PharmacoDB dataset.

                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="experiments bar plot" />
            </div>
        </div>
    );
}
export default Experiment;
