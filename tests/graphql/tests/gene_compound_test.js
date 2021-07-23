/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Gene API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const geneCompoundQueries = require('../queries/gene_compound_queries');
const { isNullOrBoolean, isNullOrNumber } = require('./helper');

/**
 * A function that contains tests for gene_compounds API.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    // test gene_compounds data for a given gene
    it('Data coming from gene_compound_tissue API route contains all experimental data for a single gene along with detailed information about dataset, tissue, gene and compound', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: geneCompoundQueries.geneCompoundTissueQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                testGeneCompoundData(res, done);
            });
    });
};

/**
 * Function that checks validity of the data returned by compound_gene API
 * Takes 2 arguments, response request body and done callback function from chai
 */
const testGeneCompoundData = (res, done) => {
    const { gene_compound_tissue } = res.body.data;
    expect(gene_compound_tissue).to.be.an('array').that.have.lengthOf.above(0);
    gene_compound_tissue.every(element => {
        expect(element).to.have.all.keys('id', 'estimate', 'lower', 'upper', 'n', 'tstat', 'fstat', 'pvalue', 'df', 'fdr', 'FWER_gene', 'FWER_compound', 'FWER_all', 'BF_p_all', 'sens_stat', 'mDataType', 'tested_in_human_trials', 'in_clinical_trials', 'gene', 'compound', 'tissue');
        const { id, estimate, lower, upper, n, tstat, fstat, pvalue, df, fdr, FWER_gene, FWER_compound, FWER_all, BF_p_all, mDataType, tested_in_human_trials, in_clinical_trials, gene, compound, tissue } = element;
        // checks the format of experimental data
        expect(id).to.be.a('number');
        expect(estimate).to.be.a('number');
        expect(lower).to.be.a('number');
        expect(upper).to.be.a('number');
        expect(n).to.satisfy(isNullOrNumber);
        expect(tstat).to.satisfy(isNullOrNumber);
        expect(fstat).to.satisfy(isNullOrNumber);
        expect(pvalue).to.be.a('number');
        expect(df).to.satisfy(isNullOrNumber);
        expect(fdr).to.satisfy(isNullOrNumber);
        expect(FWER_gene).to.be.a('number');
        expect(FWER_compound).to.satisfy(isNullOrNumber);
        expect(FWER_all).to.satisfy(isNullOrNumber);
        expect(BF_p_all).to.satisfy(isNullOrNumber);
        expect(mDataType).to.be.a('string');
        expect(tested_in_human_trials).to.satisfy(isNullOrBoolean);
        expect(in_clinical_trials).to.satisfy(isNullOrBoolean);
        // checks the format of gene object
        expect(gene).to.have.all.keys('id', 'name', 'annotation');
        expect(gene.id).to.be.a('number');
        expect(gene.name).to.be.string;
        expect(gene.annotation).to.be.an('object');
        expect(gene.annotation).to.have.all.keys('gene_id', 'gene_seq_start', 'gene_seq_end');
        // checks tissue data
        expect(tissue).to.have.all.keys('id', 'name');
        expect(tissue.id).to.be.a('number');
        expect(tissue.name).to.be.string;
        // checks the format of compound object
        expect(compound).to.have.all.keys('id', 'name', 'annotation');
        expect(compound.id).to.be.a('number');
        expect(compound.name).to.be.string;
        // checks the format of compound annotations
        expect(compound.annotation).to.be.an('object');
        expect(compound.annotation).to.have.all.keys('smiles', 'inchikey', 'pubchem', 'fda_status');
        // checks correct format of fda_status (database contains 0s or 1s)
        expect(compound.annotation.fda_status).to.be.oneOf(['Approved', 'Not Approved']);
    });

    return done();
};

module.exports = {
    test
};
