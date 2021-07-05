/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleTissueExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import ProfileCompound from '../../Plots/ProfileCompound';
import PlotsWrapper from '../../../styles/PlotsWrapper';

/**
 * A helper function that processes data from the API to be subsequently loaded it into
 * cell line and compound dataset horizontal plots
 * @param {Array} experiments - list of experiments for a given tissue returned by the API
 * @returns - array of two items. Elements of the array are a list of data points for compound and cell line plots respectively
 * Each data point contains name, count and color properties
 * @example
 * [[{name: "CTRPv2", count: 25, color: "#ccebc5"}], ... ]
 */
const generateCountPlotData = (experiments) => {
    const compoundObj = {};
    const cellLineObj = {};
    experiments.forEach((experiment) => {
        if (cellLineObj[experiment.dataset.name]) {
            cellLineObj[experiment.dataset.name].push(experiment.cell_line.id);
        } else {
            cellLineObj[experiment.dataset.name] = [experiment.cell_line.id];
        }

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
    const cellLineData = Object.entries(cellLineObj).map((dataset, i) => ({
        name: dataset[0],
        count: [...new Set(dataset[1])].length,
        color: dataset_colors[i],
    }));
    return [compoundData, cellLineData];
};
/**
 * Section that display plots for the individual tissue page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
    const { display, tissue } = props;
    const { id, name } = tissue;

    const { loading, error, data } = useQuery(getSingleTissueExperimentsQuery, {
        variables: { tissueId: id },
    });
    if (loading) {
        return '';
    }
    if (error) {
        return <p> Error! </p>;
    }
    const [compoundsData, cellLinesData] = generateCountPlotData(
        data.experiments
    );
    return (
        <>
            {id ? (
                <>
                    {
                        display === 'barPlots' &&
                        <PlotsWrapper>
                            <DatasetHorizontalPlot
                                data={cellLinesData}
                                xaxis="# of cell lines"
                                title={`Number of cell lines of ${name
                                    .replaceAll(/_/g, ' ')
                                    .replace(/([A-Z][a-z])/g, ' $1')} (per dataset)`}
                            />
                            <DatasetHorizontalPlot
                                data={compoundsData}
                                xaxis="# of compounds"
                                title={`Number of compounds tested with ${name
                                    .replaceAll(/_/g, ' ')
                                    .replace(
                                        /([A-Z][a-z])/g,
                                        ' $1'
                                    )} cell lines (per dataset)`}
                            />
                        </PlotsWrapper>
                    }
                </>
            ) : (
                display === 'barPlots' &&
                <p> No data is available for plotting this tissue. </p>
            )}
        </>
    );
};

PlotSection.propTypes = {
    tissue: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default PlotSection;
