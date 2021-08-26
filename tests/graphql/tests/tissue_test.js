/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Tissue API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const tissueQueries = require('../queries/tissue_queries');

/**
 * A function that contains tests for tissue.js.
 * This function is exported, and called in graphql.test.js.
 */

// helper function that checks the proper format of count object
const checkCount = item => {
    expect(item).to.have.all.keys('count', 'dataset');
    expect(item.count).to.be.a('number');
    expect(item.dataset).to.have.all.keys('id', 'name');
    expect(item.dataset.id).to.be.a('number');
    expect(item.dataset.name).to.be.string;
};

const test = (server) => {
    // test for all tissues route. Checks Tissue Graphql type
    it('Returns a list of all tissues with "id" and "name" properties', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: tissueQueries.multipleTissuesTestQuery })
            // .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { tissues } = res.body.data;
                expect(tissues).to.be.an('array').that.have.lengthOf.above(0);
                tissues.every(tissue => {
                    expect(tissue).to.have.all.keys('id', 'name');
                    expect(tissue.id).to.be.a('number');
                    expect(tissue.name).to.be.string;
                });
                return done();
            });
    });
    // test for a single tissue route. Checks TissueAnnotations Graphql type
    it('Returns a single tissue with "id" and "name" properties along with "synonyms", "cell_count" and "compounds_tested" data', function (done) {
        this.timeout(10000);
        request(server)
            .post('/graphql')
            .send({ query: tissueQueries.singleTissueTestQuery })
            // .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { tissue } = res.body.data;
                const { id, name, synonyms, cell_count, compounds_tested } = tissue;

                expect(tissue).to.have.all.keys('id', 'name', 'synonyms', 'cell_count', 'compounds_tested');
                expect(id).to.be.a('number');
                expect(name).to.be.string;

                // checks synonyms array format
                expect(synonyms).to.be.an('array').that.have.lengthOf.above(0);
                synonyms.every(synonym => {
                    expect(synonym).to.have.all.keys('name', 'source');
                    expect(synonym.name).to.be.string;
                    expect(synonym.source).to.be.an('array').that.have.lengthOf.above(0);
                    // checks source array format
                    synonym.source.every(source => {
                        expect(source).to.have.all.keys('id', 'name');
                        expect(source.id).to.be.a('number');
                        expect(source.name).to.be.string;
                    });
                });

                // checks cell_count array format
                expect(cell_count).to.be.an('array').that.have.lengthOf.above(0);
                cell_count.every(cell => checkCount(cell));

                // checks compounds_tested array format
                expect(compounds_tested).to.be.an('array').that.have.lengthOf.above(0);
                compounds_tested.every(compound => checkCount(compound));
                return done();
            });
    });

};

module.exports = {
    test
};
