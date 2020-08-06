/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Gene API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const experimentQueries = require('../queries/experiment_queries');

/**
 * A function that contains tests for gene.js.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    // test for a single experiment
    it('Single experiment data contains all necessary information about "cell_line", "compound" and its anootation, "tissue", "dataset" and an array of "dose_reponses"', done => {
        request(server)
            .post('/graphql')
            .send({ query: experimentQueries.singleExperimentKeysTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { experiment } = res.body.data;
                const { cell_line, compound, tissue, dataset, dose_responses } = experiment;
                expect(experiment).to.have.all.keys('id', 'cell_line', 'compound', 'tissue', 'dataset', 'dose_responses');
                // checks nested types
                expect(cell_line).to.have.all.keys('id', 'name');
                expect(tissue).to.have.all.keys('id', 'name');
                expect(dataset).to.have.all.keys('id', 'name');
                expect(compound).to.have.all.keys('id', 'name', 'annotation');
                // checks compound annotations
                expect(compound.annotation).to.have.all.keys('smiles', 'inchikey', 'pubchem', 'fda_status');
                // checks correct format of fda_status (database contains 0s or 1s)
                expect(compound.annotation.fda_status).to.be.oneOf(['Approved', 'Not Approved']);
                // checks the list of dose response
                expect(dose_responses).to.be.an('array');
                dose_responses.every(dose_reponse => expect(dose_reponse).to.have.all.keys('dose', 'response'));
                return done();
            });
    });
};

module.exports = {
    test
};
