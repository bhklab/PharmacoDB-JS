import React from 'react';
import styled from 'styled-components';

import colors from '../../../../styles/colors';

import CodeContainer from 'react-code-container'
import 'react-code-container/dist/index.css'

const StyledDescription = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 75%;
    margin-top: 8vh;

    .text-container {
        width: 100%;

        display: flex;
        flex-direction: column;

        span {
            font-size: calc(0.5vw + 0.7em);
            line-height: calc(1vw + 1em);
            margin: 4vh;
        }

        h1 {
            color: ${colors.dark_teal_heading};
            font-family: 'Roboto Slab', serif;
            font-size: calc(1.8vw + 1em) !important;
            margin-bottom: 4vh;
        }
    }

    .code-container {
      display: flex;
      flex-direction: column;
      width: 75%;
      margin: auto;
      max-width: 800px;
      border: 1px solid gray;
      padding: 10px;
      background-color:#EEEEEE;
      font-family:Consolas,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
    }

    /* mobile */
    @media only screen and (max-width: 1081px) {
        .text-container{
          width:100%;
        }
    } 
`;

/**
 * Shows the description on pharmacogx page
 *
 * @component
 * @example
 *
 * return (
 *   <PharmacoGxDescription/>
 * )
 */
const PharmacoGxDescription = (props) => {
  // parameter.
  const { dataset } = props;
  return(
      <StyledDescription>
        <div className="text-container">
          <h1>
            PharmacoGx
          </h1>
          <span>
            <p>
              PharmacoGx is an R/Bioconductor package we developed to simplify the analysis of large PharmacoGenomic Datasets.
              All the datasets included in PharmacoDB are available as R objects for analysis using PharmacoGx, with both the
              pharmacological and molecular data from each study. PharmacoGx incorporates all the annotations of each study
              available in PharmacoDB, and provides a suite of statistical modeling functions to jointly analyze molecular
              features and drug dose-response curves.
            </p>
            <p>
              PharmacoGx is simple to start using once R is installed and running on your system. If its your first time using
              PharmacoGx, download and install the package and all its dependencies by opening an R console and running the
              following commands:
            </p>
          </span>
          <div className="code-container">
            source("http://www.bioconductor.org/biocLite.R")
            biocLite("PharmacoGx")
          </div>
          <span>
            After installing for the first time, to load the package you can run the following command in your R session:
          </span>
          <div className="code-container">
            library(PharmacoGx)
          </div>
          <span>
            To download a PharmacoSet object with all the pharmacological and molecular data for {dataset.name} and begin
            analysing the data, you can use the following commands.
          </span>
          <div className="code-container">
            <p>
              # <i>Download the object for {dataset.name}</i><br/>
              {dataset.name} &lt;- downloadPSet({dataset.name})<br/>
            </p>
            <p>
              # <i>Plot Drug Dose response curves, using the same names for compounds and cell lines as PharmacoDB</i><br/>
              drugDoseResponseCurve({dataset.name}, drug="paclitaxel", cell="MCF-7")<br/>
            </p>
            {
              !["FIMM","CTRPv2"].includes(dataset.name) ?
                  (
                      <React.Fragment>
                        <p>
                          # <i>Extract the expression data to a matrix</i><br/>
                          {dataset.name}.expression &lt;- summarizeMolecularProfiles({dataset.name}, mDataType="rna")<br/>
                        </p>
                        <p>
                          # <i>Run a linear model for univariate biomarker discovery</i><br/>
                          {dataset.name}.sensitivity.signatures &lt;- drugSensitivitySig({dataset.name}, mDataType="rna", sensitivity.measure="auc_recomputed")
                        </p>
                      </React.Fragment>
                  )
                  :
                  ''
            }
          </div>
          <span>
          To learn more about the PharmacoGx package, you can download the full documentation and vignettes through our
          Bioconductor page:
          <a href="https://bioconductor.org/packages/release/bioc/html/PharmacoGx.html" target="_blank">
          PharmacoGx
          </a>
        </span>
        </div>
      </StyledDescription>
  );
}

export default PharmacoGxDescription;
