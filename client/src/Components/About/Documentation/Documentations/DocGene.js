import React from 'react';
import doseImg from '../../../../images/pharmacodb-logo.png'

const Gene = () => {
    return(
        <div className='documentation'>
            <div>
                <p>
                    Genes webpage is accessible from the experiments link at the bottom of the homepage.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="home page bottom tool bar"/>
                <p>
                    Genes webpage starts with a bar plot displaying the frequency of unique gene targets per drug.
                    Hovering over each bar shows the exact frequency.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="barplot on gene summary page"/>
                <p>
                    The webpage concludes with a table listing the names and symbols of all the genes reported in any of
                    the PharmacoDB datasets. The genes can be accessed either by clicking on their names, or by searching
                    through the search bar above the table.
                </p>
                <img height="50px" alt="dose-response curves" className="dose-img" src={doseImg} title="list of genes- gene summary table" />
            </div>
        </div>
    );
}
export default Gene;
