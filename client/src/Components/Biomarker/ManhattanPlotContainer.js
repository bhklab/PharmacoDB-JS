import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import ManhattanPlot from '../Plots/ManhattanPlot';
import { getManhattanPlotDataQuery } from '../../queries/gene_compound';
import Loading from '../UtilComponents/Loading';
import Error from '../UtilComponents/Error';
import chromosomeInfo from '../../utils/chromosomeInfo.json';
import plotColors from '../../styles/plot_colors';

const ManhattanPlotContainer = (props) => {
    const { gene, compound, tissue } = props;
    const [plotData, setPlotData] = useState([]);
    const [ready, setReady] = useState(false);
    const { loading, error } = useQuery(getManhattanPlotDataQuery, { 
        variables: { compoundName: compound, tissueName: tissue },
        onCompleted: (data) => {
            setPlotData(parsePlotData(data.gene_compound_tissue_dataset));
            setReady(true);
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
                start: item.value,
                color: plotColors.unique24[i]
            }));
        let start = 0;
        chromosomes.forEach(chr => {
            let prev = chr.start;
            chr.start = start;
            start += prev + 1
        });

        let formatted = [];
        parsed.forEach(item => {
            let chromosome = chromosomes.find(chr => chr.name === item.chr);
            if(chromosome){
                item.x = [item.gene_seq_start + chromosome.start];
                item.y = [-Math.log10(item.fdr)];
                item.color = chromosome.color;
                formatted.push(item);
            }
        });
        formatted.sort((a, b) => a.x - b.x);
        return formatted;
    };

    return(
        <div>
            {
                loading ? <Loading />
                :
                error ? <Error />
                :
                ready &&
                <ManhattanPlot plotId='biomarkerManhattanPlot' data={plotData} />
            }
        </div>
    );
}

export default ManhattanPlotContainer;