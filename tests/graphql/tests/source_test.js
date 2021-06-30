/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Source API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const sourceQueries = require('../queries/source_queries');

/**
 * A function that contains tests for sources.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    it('Test to validate the "id" and "name" for all the sources and dataset object for the sources and checking for the correctness of datatype', done => {
        request(server)
            .post('/graphql')
            .send({ query: sourceQueries.allSourcesTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { sources } = res.body.data;
                sources.every(source => {
                    const {id, name, dataset} = source;
                    // expect to have all the data for source object.
                    expect(source).to.have.all.keys('id', 'name', 'dataset');
                    // expect id to be a number.
                    expect(id).to.be.a('number');
                    // expect name to be a string.
                    expect(name).to.be.a('string');

                    // expect id and name for dataset object.
                    expect(dataset).to.have.all.keys('id', 'name');
                    // expect id to be a number.
                    expect(dataset.id).to.be.a('number');
                    // expect name to be a string.
                    expect(dataset.name).to.be.a('string');
                });
                return done();
            });
    });

    it('Test to validate the source stats', done => {
        request(server)
            .post('/graphql')
            .send({query: sourceQueries.sourceStatsTestQuery})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { source_stats } = res.body.data;
                source_stats.every(stat => {
                    const { source_id, source_name, cell_line_count, tissue_count, compound_count, experiment_count } = stat;
                    // testing to see if stat object has all the keys.
                    expect(stat).to.have.all.keys('source_id', 'source_name', 'cell_line_count', 'tissue_count', 'compound_count', 'experiment_count');
                    // check for the data type.
                    expect(source_id).to.be.a('number');
                    expect(source_name).to.be.a('string');
                    expect(cell_line_count).to.be.a('number');
                    expect(tissue_count).to.be.a('number');
                    expect(compound_count).to.be.a('number');
                    expect(experiment_count).to.be.a('number');
                });
                return done();
            });
    });
};

module.exports= {
    test
};