/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Gene API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const geneDrugQueries = require('../queries/gene_drug_queries');

/**
 * A function that contains tests for gene_drugs API.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    // test gene_drugs data for a given gene
    it('Data coming from gene_drugs API route contains all experimental data for a single gene along with detailed information about dataset, tissue, gene and compound', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: geneDrugQueries.geneDrugSearchByGeneQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                testGeneDrugData(res, done);
            });
    });
    // test gene_drugs data for a given compound
    it('Data coming from gene_drugs API route contains all experimental data for a single compound along with detailed information about dataset, tissue, gene and compound', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: geneDrugQueries.geneDrugSearchByDrugQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                testGeneDrugData(res, done);
            });
    });
};

/**
 * Function that checks validity of the data returned by drug_gene API
 * Takes 2 arguments, response request body and done callback function from chai
 */
const testGeneDrugData = (res, done) => {
    const { gene_drugs } = res.body.data;
    expect(gene_drugs).to.be.an('array').that.have.lengthOf.above(0);
    gene_drugs.every(gene_drug => {
        expect(gene_drug).to.have.all.keys('id', 'estimate', 'se', 'n', 'tstat', 'fstat', 'pvalue', 'df', 'fdr', 'FWER_genes', 'FWER_drugs', 'FWER_all', 'BF_p_all', 'mDataType', 'level', 'drug_like_molecule', 'in_clinical_trials', 'dataset', 'gene', 'compound', 'tissue');
        const { id, estimate, se, n, tstat, fstat, pvalue, df, fdr, FWER_genes, FWER_drugs, FWER_all, BF_p_all, mDataType, level, drug_like_molecule, dataset, gene, compound, tissue } = gene_drug;
        // checks the format of experimental data
        expect(id).to.be.a('number');
        expect(estimate).to.be.a('number');
        expect(se).to.be.a('number');
        expect(n).to.be.a('number');
        expect(tstat).to.be.a('number');
        expect(fstat).to.be.a('number');
        expect(pvalue).to.be.a('number');
        expect(df).to.be.a('number');
        expect(fdr).to.be.a('number');
        expect(FWER_genes).to.be.a('number');
        expect(FWER_drugs).to.be.a('number');
        expect(FWER_all).to.be.a('number');
        expect(BF_p_all).to.be.a('number');
        expect(mDataType).to.be.a('string');
        expect(level).to.be.a('number');
        expect(drug_like_molecule).to.be.a('number');
        // checks the format of gene object
        expect(gene).to.have.all.keys('id', 'name', 'annotation');
        expect(gene.id).to.be.a('number');
        expect(gene.name).to.be.string;
        expect(gene.annotation).to.be.an('object');
        expect(gene.annotation).to.have.all.keys('gene_id', 'ensg', 'gene_seq_start', 'gene_seq_end');
        // checks tissue data
        expect(tissue).to.have.all.keys('id', 'name');
        expect(tissue.id).to.be.a('number');
        expect(tissue.name).to.be.string;
        // checks the format of dataset object
        expect(dataset).to.have.all.keys('id', 'name');
        expect(dataset.id).to.be.a('number');
        expect(dataset.name).to.be.string;
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