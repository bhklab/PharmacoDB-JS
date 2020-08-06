/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Dataset API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const datasetQueries = require('../queries/dataset_queries');

/**
 * A function that contains tests for datasets.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    it('Tests for the presence of the "id" and "name" for all the enteries and also checking the datatype.', done => {
        request(server)
            .post('/graphql')
            .send({ query: datasetQueries.datasetsKeysTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { datasets } = res.body.data;
                datasets.every(dataset => {
                    // expect to have all the data.
                    expect(dataset).to.have.all.keys('id', 'name');
                    // expect id to be a number.
                    expect(dataset.id).to.be.a('number'),
                    // expect name to be a string.
                    expect(dataset.name).to.be.a('string');
                });

                return done();
            });
    });
};

module.exports= {
    test
};