import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png';

const CellVsDrug = () => {
    return(
        <div className='documentation'>
            <div>
                <p>
                    Each cell line-drug combination included in PharmacoDB has a webpage associated with it. This
                    page can be accessed by typing the names of the cell line and drug into the search bar, separated
                    by a space. The order of cell line and drug names do not matter.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="searching cell/drug pair"/>
                <p>
                    The page contains a plot recording the doses of that drug tested on that cell line in each dataset,
                    along with the cell viability values that were observed at those doses. Each replicate from each
                    dataset of the experiment is plotted separately. There is also a summary statistics table which has
                    hoverable/clickable statistics for each experiment.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title=" cell/drug pair page"/>
            </div>
        </div>
    );
}
export default CellVsDrug;
