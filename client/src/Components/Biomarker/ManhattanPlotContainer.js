import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import ManhattanPlot from '../Plots/ManhattanPlot';
import { getManhattanPlotDataQuery } from '../../queries/gene_compound';
import Loading from '../UtilComponents/Loading';
import Error from '../UtilComponents/Error';
import chromosomeInfo from '../../utils/chromosomeInfo.json';
import plotColors from '../../styles/plot_colors';
import colors from '../../styles/colors';
import styled from 'styled-components';
import Select from 'react-select';

const StyledManhattanPlotContainer = styled.div`
    .dropdown-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .dropdown {
            width: 140px;
            font-size: 14px;
            color: ${colors.dark_teal_heading};
            .dropdown__control {
                min-height: 20px;
                .dropdown__single-value {
                    color: ${colors.dark_teal_heading};
                }
                .dropdown__indicators {
                    .dropdown__indicator {
                        padding: 0px;
                    }
                }
            }
            .dropdown__menu {
                .dropdown__menu-list {
                    padding 3px
                    .dropdown__option {
                        padding: 3px;
                    }
                }
            }
        }
    }
`;

const mDataTypeOptions = [
    { label: 'cnv', value: 'cnv' },
    { label: 'microarray', value: 'rna' },
    { label: 'rnaseq', value: 'Kallisto_0.46.1.rnaseq' },
];

const ManhattanPlotContainer = (props) => {
    const { compound, tissue } = props;
    const [mDataType, setMDataType] = useState('cnv');
    const [plotData, setPlotData] = useState({
        ready: false
    });

    // const { loading, error } = useQuery(getManhattanPlotDataQuery, { 
    //     variables: { compoundName: compound, tissueName: tissue, mDataType: mDataType },
    //     onCompleted: (data) => {
    //         setPlotData(parsePlotData(data.gene_compound_tissue_dataset));
    //     },
    //     onError: (error) => {
    //         console.log(error);
    //     }
    // });

    // Use lazy query to trigger query upon mDataType selection.
    const [ getData, { loading, error } ] = useLazyQuery(getManhattanPlotDataQuery, {

    useEffect(() => {
        console.log(mDataType);
        getData({ variables: { compoundName: compound, tissueName: tissue, mDataType: mDataType } });
    }, [mDataType]);

    const parsePlotData = (data) => {
        let parsed = data.map(item => ({
            dataset: item.dataset,
            gene: {
                id: item.gene.id,
                name: item.gene.name,
                symbol: item.gene.annotation.symbol
            },
            chr: item.gene.annotation.chr,
            fdr: item.fdr_permutation ? item.fdr_permutation : item.fdr_analytic,
            gene_seq_start: item.gene.annotation.gene_seq_start
        }));

        let chromosomes = chromosomeInfo["Chromosome Info"]
            .filter(item => item["molecule-name"] !== 'all')
            .map((item, i) => ({
                name: `chr${item["molecule-name"]}`,
                label: item["molecule-name"],
                start: item.value,
                length: item.value,
                color: plotColors.unique24[i]
            }));
        let start = 0;
        chromosomes.forEach(chr => {
            let prev = chr.start;
            chr.start = start;
            chr.end = start + chr.length;
            chr.labelValue = start + Math.floor(((start + chr.length) - start) / 2);
            start += prev + 1
        });

        let chromosomeNames = chromosomes.map(item => item.name);
        let formatted = [];
        parsed.forEach(item => {
            if (chromosomeNames.includes(item.chr)) {
                let chromosome = chromosomes.find(chr => chr.name === item.chr);
                item.x = item.gene_seq_start + chromosome.start;
                item.y = -Math.log10(item.fdr);
                item.color = chromosome.color;
                item.chrLabel = chromosome.label;
                formatted.push(item);
            }
        });
        formatted.sort((a, b) => a.x - b.x);
        console.log(formatted);
        return {
            data: formatted,
            xRange: [0, Math.max(...chromosomes.map(item => item.end))],
            xLabelValues: {
                values: chromosomes.map(item => item.labelValue),
                labels: chromosomes.map(item => item.label)
            },
            ready: true
        };
    };

    return(
        <StyledManhattanPlotContainer>
            <div className='dropdown-container'>
                <Select 
                    className='dropdown' 
                    classNamePrefix='dropdown'
                    options={mDataTypeOptions} 
                    defaultValue={mDataTypeOptions[0]}
                    onChange={(e) => setMDataType(e.value)}
                />
            </div>
            {
                loading ? <Loading />
                    :
                    error ? <Error />
                        :
                        plotData.ready &&
                        <ManhattanPlot
                            plotId='biomarkerManhattanPlot'
                            // title={`${compound} + ${tissue}`}
                            data={plotData.data}
                            xRange={plotData.xRange}
                            xLabelValues={plotData.xLabelValues}
                        />
            }
        </StyledManhattanPlotContainer>
    );
}

export default ManhattanPlotContainer;