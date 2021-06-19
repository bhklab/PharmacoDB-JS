/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Gene API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const experimentQueries = require('../queries/experiment_queries');

/**
 * A function that contains tests for experiment API.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    // test for a single experiment
    it('Data coming from single experiment API route contains all necessary information about "cell_line", "compound" and its anootation, "tissue", "dataset", "profile" and an array of "dose_reponse"', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: experimentQueries.singleExperimentTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { experiment } = res.body.data;
                const { cell_line, compound, tissue, dataset, profile, dose_response } = experiment;
                expect(experiment).to.have.all.keys('id', 'cell_line', 'compound', 'tissue', 'dataset', 'profile', 'dose_response');
                // checks cell line data
                expect(cell_line).to.have.all.keys('id', 'name', 'tissue');
                expect(cell_line.id).to.be.a('number');
                expect(cell_line.name).to.be.string;
                expect(cell_line.tissue).to.be.an('object');
                expect(cell_line.tissue).to.have.all.keys('id', 'name');
                // checks tissue data
                expect(tissue).to.have.all.keys('id', 'name');
                expect(tissue.id).to.be.a('number');
                expect(tissue.name).to.be.string;
                // checks dataset data
                expect(dataset).to.have.all.keys('id', 'name');
                expect(dataset.id).to.be.a('number');
                expect(dataset.name).to.be.string;
                // checks compound data
                expect(compound).to.have.all.keys('id', 'name', 'annotation');
                expect(compound.id).to.be.a('number');
                expect(compound.name).to.be.string;
                // checks compound annotations
                expect(compound.annotation).to.be.an('object');
                expect(compound.annotation).to.have.all.keys('smiles', 'inchikey', 'pubchem', 'fda_status');
                // checks correct format of fda_status (database contains 0s or 1s)
                expect(compound.annotation.fda_status).to.be.oneOf(['Approved', 'Not Approved']);
                // checks if all profiles are present
                expect(profile).to.have.all.keys('HS', 'Einf', 'EC50', 'AAC', 'IC50', 'DSS1', 'DSS2', 'DSS3');
                // checks the list of dose response
                expect(dose_response).to.be.an('array').that.have.lengthOf.above(0);
                dose_response.every(reponse => expect(reponse).to.have.all.keys('dose', 'response'));
                return done();
            });
    });

    // test for multiple experiments (validates subset of first 50 entries)
    it('Data coming from multiple experiments API route contains all necessary information about "cell_line", "compound" and its anotation, "tissue", "dataset", "profile" and an array of "dose_reponse"', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: experimentQueries.multipleExperimentsTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { experiments } = res.body.data;
                expect(experiments).to.be.an('array').that.have.lengthOf.above(0);
                experiments.every(experiment => {
                    expect(experiment).to.have.all.keys('id', 'cell_line', 'compound', 'tissue', 'dataset', 'profile', 'dose_response');
                    const { cell_line, compound, tissue, dataset, profile, dose_response } = experiment;
                    // checks if relationship with cell_line, tissue, dataset, compound, profile and dose_response are present and data has correct format
                    expect(cell_line).to.have.all.keys('id', 'name', 'tissue');
                    expect(cell_line.tissue).to.have.all.keys('id', 'name');
                    expect(tissue).to.have.all.keys('id', 'name');
                    expect(dataset).to.have.all.keys('id', 'name');
                    expect(compound).to.have.all.keys('id', 'name', 'annotation');
                    expect(compound.annotation).to.have.all.keys('smiles', 'inchikey', 'pubchem', 'fda_status');
                    expect(profile).to.have.all.keys('HS', 'Einf', 'EC50', 'AAC', 'IC50', 'DSS1', 'DSS2', 'DSS3');
                    expect(dose_response).to.be.an('array').that.have.lengthOf.above(0);
                    dose_response.every(reponse => expect(reponse).to.have.all.keys('dose', 'response'));
                });
                return done();
            });
    });

    // test multiple experiments route with filtering by a single compound
    it('Experiments route returns correct data when querying by single compound id', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: experimentQueries.singleCompoundExperimentsTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { experiments } = res.body.data;
                // expects to serve all experiments for a given drug instead of just a small subset
                expect(experiments).to.be.an('array').that.have.lengthOf.above(50);
                experiments.every(experiment => {
                    // expects certain types to be returned as indicated in the graphQL query
                    expect(experiment).to.have.all.keys('id', 'cell_line', 'compound', 'tissue', 'dataset', 'profile');
                    // compound.id should match the one indicated in the query 
                    expect(experiment.compound.id).to.equal(1);
                });
                return done();
            });
    });
};

module.exports = {
    test
};
