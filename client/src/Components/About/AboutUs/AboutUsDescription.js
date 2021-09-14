import React, { useState } from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom'
import colors from '../../../styles/colors';
import cellExmp from '../../../images/DocumentationImages/exmpMCF7.png';
import tissueExmp from '../../../images/DocumentationImages/exmpBreast.png';

const StyledDescription = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: justify;

    width: 70%;
    margin-top: 8vh;

    .text-container {
        width: 100%;

        display: flex;
        flex-direction: column;

        span {
            font-size: calc(0.5vw + 0.7em);
            line-height: calc(1vw + 1em);
        }

        h1 {
            color: ${colors.dark_teal_heading};
            font-family: 'Roboto Slab', serif;
            font-size: calc(1.8vw + 1em) !important;
            margin-bottom: 4vh;
        }

        .caption {
          text-align: left;
          margin-top: 10px;
          margin-bottom: 10px;
          color: ${colors.silver};
          font-size: clamp(12px, calc(1vw + 2px), 15px);;
        }
      
        .paragraph {
          margin-bottom: 15px;
        }
    }

    /* mobile */
    @media only screen and (max-width: 1081px) {
        .text-container{
          width:100%;
        }
    } 
`;

/**
 * Shows the description on the about us page
 *
 * @component
 * @example
 *
 * return (
 *   <AboutUsDescription/>
 * )
 */
const AboutUsDescription = () => {
  const [showCell, setShowCell] = React.useState(false);
  const [showTissue, setShowTissue] = React.useState(false);
  const [showDrug, setShowDrug] = React.useState(false);
  const [showDDRC, setShowDDRC] = React.useState(false);
  const onClick = (selected) => {
    if (selected === "cell") setShowCell(!showCell)
    else if (selected === "tissue") setShowTissue(!showTissue)
    else if (selected === "drug") setShowDrug(!showDrug)
    else if (selected === "ddrc") setShowDDRC(!showDDRC)
  }
  return(
    <StyledDescription>
      <div className="text-container">
        <h1>
          About PharmacoDB
        </h1>
        <span>
          <p>High throughput drug screening technologies have enabled the profiling of hundreds of cancer cell lines to a
          large variety of small molecules to discover novel and repurposed treatments. Several large studies have been
          publicly released testing candidate molecules, often with corresponding molecular profiles of the cell lines
          used for drug screening. These studies have become invaluable resources for the research community, allowing
          researchers to leverage the collected data to support their own research. However, such pharmacogenomic datasets
          are disparate and lack of standardization for cell line and drug identifiers, and used heterogeneous data format
          for the drug sensitivity measurements.</p>
          <p>To address these issues, we developed PharmacoDB, a web-application assembling the largest in vitro drug screens
          in a single database, and allowing users to easily query the union of studies released to date. PharmacoDB
          allows scientists to search across publicly available datasets to find instances where a drug or cell line of
          interest has been profiled, and to view and compare the dose-response data for a specific cell line - drug pair
          from any of the studies included in the database.</p>
          <p>If you use PharmacoDB in your research please cite the following publication:<br/>
          <ul>
            <li>
              <a href="https://academic.oup.com/nar/article/46/D1/D994/4372597" target="_blank">Smirnov, Petr, et al. "PharmacoDB: an integrative database for mining in vitro anticancer drug
                screening studies." Nucleic Acids Research (2017).</a>
            </li>
          </ul>
            Go to the <Link to="./cite">Cite Us!</Link> page for more details.</p>
        </span><br/><br/><br/>
        <h1>
          Examples of queries
        </h1>
        <span>
          <div className="paragraph">Cell lines? Try typing <a id="hide-cl-overlay" href="javaScript:void(0);" onClick={() =>onClick("cell")}>MCF-7</a>
            {
              showCell ?
                  <div className="caption" id=" overlay-caption">
                    <img  height="auto" width="500px" alt="Searching MCF-7" className="documentation" src={cellExmp} title="Query Cell line"/><br/>
                    Example search for a cell line.
                  </div>
                : null
            }
          </div>
          <div className="paragraph">Tissues? Try typing <a id="hide-t-overlay" href="javaScript:void(0);" onClick={() =>onClick("tissue")}>Breast</a>
            {
              showTissue ?
                  <div className="caption" id=" overlay-caption">
                    <img  height="auto" width="500px" alt="Searching Breast" className="documentation" src={tissueExmp} title="Query Tissue"/><br/>
                    Example search for a tissue.
                  </div>
                : null
            }
          </div>
          <div className="paragraph">Drugs? Try typing <a id="hide-d-overlay"href="javaScript:void(0);" onClick={() =>onClick("drug")}>Paclitaxel</a>
            {
              showDrug ?
                    <div className="caption" id=" overlay-caption"> Example search for a drug. </div>
                  : null
            }
          </div>
          <div className="paragraph">Drug dose-response curves? Try typing <a id="hide-ddrc-overlay" href="javaScript:void(0);" onClick={() =>onClick("ddrc")}>MCF7 Paclitaxel</a>
            {
              showDDRC ?

                    <div className="caption" id=" overlay-caption"> Example search for a drug dose-response curve. </div>
                  : null
            }
          </div>
          <div><Link to="/">Start searching</Link> across pharmacogenomic datasets and do not hesitate to give us feedback on
            <a href="https://github.com/bhklab/PharmacoDB" target="_blank"> GitHub</a>.</div>
        </span><br/><br/><br/>
        <h1>
          About the Lab
        </h1>
        <span>
          The <a href="https://www.pmgenomics.ca/bhklab/" target="_blank">BHKLAB </a>
          is composed of a multidisciplinary team of researchers analyzing high-dimensional molecular and imaging data to
          develop new predictive tools foranticancer therapies. We develop databases and analysis pipelines to leverage
          large compendia of pharmacogenomic datasets for biomarker discovery and drug repurposing. The BHKLAB is part of
          the Princess Margaret Cancer Centre – University Health Network, located in the heart of the Toronto Discovery
          District in Ontario, Canada. <br/>
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4364889480303!2d-79.39081378450204!3d43.65989117912103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34b632b77689%3A0x901c210dff19e5a4!2s101+College+St%2C+Toronto%2C+ON+M5G+1L7!5e0!3m2!1sen!2sca!4v1502307889999"
              width="100%" height="600" align="center" allowFullScreen>
          </iframe>
        </span>
      </div>
    </StyledDescription>
)};

export default AboutUsDescription;
