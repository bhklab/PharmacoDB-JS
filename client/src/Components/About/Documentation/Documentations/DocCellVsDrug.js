import React from 'react';
import cellDrug from '../../../../images/DocumentationImages/mcf-7PacliSearch.png';
import cellDrugPlot from '../../../../images/DocumentationImages/mcf_pacli_plot.png';
import cellDrugTable from '../../../../images/DocumentationImages/mcf7_pacli_table.png';

/**
 * Shows the Cell line Vs Compound description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocCellVsDrug/>
 * )
 */
const DocCellVsDrug = () => {
    return(
        <div className='documentation'>
            <p>Each cell line-compound combination included in PharmacoDB has a webpage associated with it. This page can be accessed by typing the names of the cell line and compound into the search bar, separated by a space. The order of cell line and compound names do not matter.</p>
            <div className="center"><img className="bar" src={cellDrug}/></div>
            <p>The page starts with a plot recording the doses at which the compound of query tested on the cell line of query in each dataset, along with the cell viability values that were observed at those doses. Each replicate from each dataset of the experiment is plotted separately. Hovering over each point on the plot shows the name of the associated dataset as well as the dose and viability response measures of the experiment.</p>
            <div className="center"><img src={cellDrugPlot}/></div>
            <p>The page concludes with a table summarising measurements such as AAC, IC50, EC50 and Einf where available. Clicking on each dataset name or value directs you to the corresponding page.</p>
            <div className="center"><img className="small" src={cellDrugTable}/></div>
        </div>
    );
}
export default DocCellVsDrug;
