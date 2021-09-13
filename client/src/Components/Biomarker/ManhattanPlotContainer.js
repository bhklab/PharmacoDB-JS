import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import ManhattanPlot from '../Plots/ManhattanPlot';
import { getManhattanPlotDataQuery } from '../../queries/gene_compound';
import Loading from '../UtilComponents/Loading';
import Error from '../UtilComponents/Error';
import chromosomeInfo from '../../utils/chromosomeInfo.json';
import plotColors from '../../styles/plot_colors';

const ManhattanPlotContainer = (props) => {
    const { compound, tissue } = props;
    const [plotData, setPlotData] = useState({
        ready: false
    });
    const { loading, error } = useQuery(getManhattanPlotDataQuery, { 
        variables: { compoundName: compound, tissueName: tissue },
        onCompleted: (data) => {
            setPlotData(parsePlotData(data.gene_compound_tissue_dataset));
        },
        onError: (error) => {
            console.log(error);
        }
    });

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
            chr.labelValue = start + Math.floor(((start + chr.length) - start)/2);
            start += prev + 1
        });

        let chromosomeNames = chromosomes.map(item => item.name);
        let formatted = [];
        parsed.forEach(item => {
            if(chromosomeNames.includes(item.chr)){
                let chromosome = chromosomes.find(chr => chr.name === item.chr);
                item.x = item.gene_seq_start + chromosome.start;
                item.y = -Math.log10(item.fdr);
                item.color = chromosome.color;
                item.chrLabel = chromosome.label;
                formatted.push(item);
            }
        });
        formatted.sort((a, b) => a.x - b.x);

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
        <div>
            {
                loading ? <Loading />
                :
                error ? <Error />
                :
                plotData.ready &&
                <ManhattanPlot 
                    plotId='biomarkerManhattanPlot' 
                    title={`${compound} + ${tissue}`}
                    data={plotData.data} 
                    xRange={plotData.xRange} 
                    xLabelValues={plotData.xLabelValues} 
                />
            }
        </div>
    );
}

export default ManhattanPlotContainer;