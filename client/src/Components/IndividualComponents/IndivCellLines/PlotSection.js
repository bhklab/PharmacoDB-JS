/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getCellLinesQuery } from '../../../queries/cell';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import ProfileCompound from '../../Plots/ProfileCompound';

/**
 * A helper function that processes data from the API to be subsequently loaded it into
 * compound horizontal plots
 * @param {Array} experiments - list of experiments for a given cell line returned by the API
 * @returns - array of items. Elements of the array are a list of data points for compound plots respectively
 * Each data point contains name, count and color properties
 * @example
 * [{name: "GDSC1000", count: 208, color: "#08589e"}, ... ]
 */
const generateCountPlotData = (experiments) => {
    const compoundObj = {};
    experiments.forEach((experiment) => {
        if (compoundObj[experiment.dataset.name]) {
            compoundObj[experiment.dataset.name].push(experiment.compound.id);
        } else {
            compoundObj[experiment.dataset.name] = [experiment.compound.id];
        }
    });
    const compoundData = Object.entries(compoundObj).map((dataset, i) => ({
        name: dataset[0],
        count: [...new Set(dataset[1])].length,
        color: dataset_colors[i],
    }));
    return [compoundData];
};
/**
 * Section that display plots for the individual cell Line page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
    const { display, cellLine } = props;
    const { id, name } = cellLine;

    const { loading, error, data } = useQuery(
        getCellLinesQuery, {
            fetchPolicy: "network-only",
            }
    );

    const cellLineData = data? data.experiments : [];
    const [compoundsData] = useMemo(() => generateCountPlotData(cellLineData), [cellLineData]);

    if (error) {
        return <p> Error! </p>;
    }
<<<<<<< HEAD
    // if (!loading) console.log(data.cell_lines);
    let count = 0
    data.cell_lines.forEach((x)=>
        (x["dataset"]["name"]==="CCLE") ? count +=1 : count = count)
    console.log(count)
    const [compoundsData] = generateCountPlotData(data.experiments);
=======
    
>>>>>>> 8b8743eedd245db5faf7db10d95bcfc5c8beb7a4
    return (
        <>
            {compoundsData.length ? (
                <>
                    {
                        display === 'barPlot' ?
                            loading ? <Loading />
                            :
                            <DatasetHorizontalPlot
                                data={compoundsData}
                                xaxis="# of compounds"
                                title={`Number of compounds tested with ${name} (per dataset)`}
                            />
                            :
                        ''
                    }
                    {
                        display === 'aacCompounds' ?
                            loading ? <Loading />
                            :
                            <ProfileCompound 
                                cellLine={name} 
                                data={data.experiments} 
                            />
                        :
                        ''
                    }
                </>
            ) : (
                <p> No data is available for plotting this cell line. </p>
            )}
        </>
    );
};

PlotSection.propTypes = {
    cellLine: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default PlotSection;
