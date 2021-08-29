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
    it('Test to validate the "id" and "name" for all the datasets and checking for the correctness of datatype', function (done) {
        this.timeout(30000);
        request(server)
            .post('/graphql')
            .send({ query: datasetQueries.multipleDatasetsTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { datasets } = res.body.data;
                datasets.every(dataset => {
                    // expect to have all the data.
                    expect(dataset).to.have.all.keys('id', 'name');
                    const { id, name} = dataset;
                    // expect id to be a number
                    expect(id).to.be.a('number');
                    // expect name to be a string.
                    expect(name).to.be.a('string');
                });
                return done();
            });
    });

    it('Test to validate data from a single dataset with Compound Id 2 ie "CTRPv2" as the argument', function (done) {
        this.timeout(30000);
        request(server)
            .post('/graphql')
            .send({ query: datasetQueries.singleDatasetTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { dataset: values } = res.body.data;
                values.every(dataset => {
                    if (dataset.id === 2) {
                        // expect cells_tested to be a string.
                        expect(dataset.cells_tested).to.be.an('array').that.have.lengthOf.above(0);
                        // expect compounds_tested to be a string.
                        expect(dataset.compounds_tested).to.be.an('array').that.have.lengthOf.above(0);
                    } else {
                        // expect cells_tested to be a string.
                        expect(dataset.cells_tested).to.be.null;
                        // expect compounds_tested to be a string.
                        expect(dataset.compounds_tested).to.be.null;
                    }

                    // expect to have all the data.
                    expect(dataset).to.have.all.keys('id', 'name', 'cell_count',
                        'cells_tested', 'compound_tested_count', 'compounds_tested',
                        'experiment_count', 'tissue_tested_count');

                    // expect id to be a number.
                    expect(dataset.id).to.be.a('number');
                    // expect name to be a string.
                    expect(dataset.name).to.be.a('string');
                    // expect cell_count to be a number.
                    expect(dataset.cell_count).to.be.a('number');
                    // expect tissue_tested_count to be a number.
                    expect(dataset.tissue_tested_count).to.be.a('number');
                    // expect id to be a number.
                    expect(dataset.compound_tested_count).to.be.a('number');
                    // expect id to be a number.
                    expect(dataset.experiment_count).to.be.a('number');
                });
                return done();
            });
    });

    it('Test to validate "id" and "name" for all datasets and checking for the correctness of datatype as well as compound_count , cell_line_count, tissues_count, and experiments_count for each dataset', function (done) {
        this.timeout(30000);
        request(server)
            .post('/graphql')
            .send({ query: datasetQueries.allDatasetsStatsTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { dataset_stats } = res.body.data;
                dataset_stats.every(datasetStat => {
                    // expect to have all the data.
                    expect(datasetStat).to.have.all.keys('dataset', 'cell_line_count', 'experiment_count', 'compound_count', 'tissue_count');
                    const { dataset, cell_line_count, experiment_count, compound_count, tissue_count} = datasetStat;
                    // checks dataset data
                    expect(dataset).to.be.an('object');
                    expect(dataset).to.have.all.keys('id', 'name');
                    expect(dataset.id).to.be.a('number');
                    expect(dataset.name).to.be.string;
                    // checks dataset data
                    expect(cell_line_count).to.be.a('number');
                    expect(experiment_count).to.be.a('number');
                    expect(compound_count).to.be.a('number');
                    expect(tissue_count).to.be.a('number');
                });
                return done();
            });
    });
};

module.exports = {
    test
};
