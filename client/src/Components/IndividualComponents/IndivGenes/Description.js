/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getGeneTargetCountCompoundsByDataset} from '../../../queries/target';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import { Element } from 'react-scroll';

/**
 * A helper function that processes data from the ensembl API to extract gene description and location
 * @param {Object} geneDes - object of gene descriptions for a given gene ensembl id returned by the API
 * @returns - object of gene information, including gene description and location
 * @example
 * [{description: "BRCA2 DNA repair associated", location: ""}]
 */
const generateDescriptionData = (gene) => {
    const des = gene["description"]
    const hgncId = des.substring(des.indexOf("HGNC:"), des.length -1);
    const hgncLink = `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${hgncId}`;
    // location information
    const strand = gene["strand"] === 1 ? "forward strand" : "reverse strand";
    const location = gene["seq_region_name"]+":"+gene["start"]+"-"+gene["end"];
    const locLink = `http://useast.ensembl.org/Homo_sapiens/Location/View?db=core;g=${hgncId};r=${location}`
    const returnObj = {
        des: (
            <div className="text">
                { des.substring(0, des.indexOf("HGNC:"))}
                <a href={hgncLink} target="_blank">{hgncId}</a>
                {des.substring(des.length-1)}
            </div>
            ),
        loc: (
            <div className="text">
                <a href={locLink} target="_blank">{ "Chromosome "+ location + " "}</a>
                {strand + "."}
            </div>
        )
    }
    return returnObj;
};
/**
 * Section that displays gene description on individual gene page
 *
 * @component
 * @example
 *
 * returns (
 *   <Description/>
 * )
 */
const Description = (props) => {
    const { gene } = props;

    const xrefLink = `https://rest.ensembl.org/xrefs/id/${gene.name}?content-type=application/json`;
    const descLink = `https://rest.ensembl.org/lookup/id/${gene.name}?content-type=application/json`;

    const [error, setError] = useState(null);
    const [err, setErr] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [geneDes, setGeneDes] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [geneSyn, setGeneSyn] = useState([]);
    useEffect(() => {
        if(gene.annotation) {
            fetch(descLink)
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true);
                        setGeneDes(result);
                    },
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
            fetch(xrefLink)
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoaded(true);
                        setGeneSyn(result.filter(ref => ref.synonyms.length ).map(ref => ref.synonyms));
                    },
                    (error) => {
                        setLoaded(true);
                        setError(err);
                    }
                )
        }
    }, [gene.annotation])
    console.log(Object.keys(geneDes).length, geneDes, geneSyn.length, geneSyn)
    return (
        <React.Fragment>
            {
                !isLoaded || !loaded ? <Loading />
                :
                error || err ? <Error />
                :
                    <React.Fragment>
                        {Object.keys(geneDes).length ?
                            (
                                <Element className="section">
                                    <div className='section-title'>Description</div>
                                    {geneDes["description"].length ?
                                        (<div className="text">
                                            {generateDescriptionData(geneDes)["des"]}
                                        </div>)
                                        : <h6>N/A</h6>}
                                </Element>
                            ): ''
                            }
                        {
                            geneSyn.length ?
                            <Element className="section">
                                <div className='section-title'>Synonyms</div>
                                {
                                    geneSyn.length ?
                                        <div className="text">{ geneSyn[0].join(", ")}</div>
                                        : <h6>N/A</h6>
                                }
                            </Element>
                            :''
                        }
                        {Object.keys(geneDes).length ?
                            <Element className="section">
                                <div className='section-title'>Location</div>
                                {geneDes["description"].length ?
                                    (<div className="text">
                                        {generateDescriptionData(geneDes)["loc"]}
                                    </div>)
                                    : <h6>N/A</h6>}
                            </Element>
                            :''
                        }
                    </React.Fragment>

            }
        </React.Fragment>
    );
};

Description.propTypes = {
    gene: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default Description;
