import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import ManhattanPlot from '../Plots/ManhattanPlot';
import { getManhattanPlotDataQuery } from '../../queries/gene_compound';
import Loading from '../UtilComponents/Loading';

const ManhattanPlotContainer = (props) => {
    const { gene, compound, tissue } = props;

    const { loading } = useQuery(getManhattanPlotDataQuery, { 
        variables: { compoundName: compound, tissueName: tissue },
        onCompleted: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return(
        <div>
            {
                loading ? <Loading />
                :
                <ManhattanPlot />
            }
        </div>
    );
}

export default ManhattanPlotContainer;