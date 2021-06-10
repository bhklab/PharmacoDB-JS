import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import { getCompoundTarget } from '../../queries/target';
import SnakeCase from '../../utils/convertToSnakeCase';
import Layout from '../UtilComponents/Layout';
import StyledWrapper from '../../styles/utils';
import { StyledIndivPage, StyledSidebar } from '../../styles/IndivPageStyles';

// side links.
const SIDE_LINKS = ['Gene Information', 'Drug Information', 'Forest Plots']

/**
 *
 * @param {String} link
 */
const createSideLink = (link) => <Link key={link} className="link" activeClass="selected" to={`${SnakeCase(link)}`} spy smooth duration={200} offset={-400}>{link}</Link>;

const Biomarker = () => {
    return (
        <Layout>
            <StyledWrapper>
                <StyledIndivPage>
                    <StyledSidebar>
                        {
                            SIDE_LINKS.map((link) => createSideLink(link))
                        }
                    </StyledSidebar>
                    <div className="container">
                        <div className="content">
                            <Element className="section" name="gene_information">
                                <h3>Gene Information</h3>
                            </Element>
                            <Element className="section" name="drug_information">
                                <h3>Drug Information</h3>
                            </Element>
                            <Element className="section" name="plots">
                                <h3>Plots</h3>
                            </Element>
                        </div>
                    </div>
                </StyledIndivPage>
            </StyledWrapper>
        </Layout>
    );
}


export default Biomarker;
