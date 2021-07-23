/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Cell API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const cellQueries = require('../queries/cell_queries');

/**
 * A function that contains tests for compound.js.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    // Tests all cell lines return by the API. Cell lines belong to CellLine graphql type
    it('Returns "id" and "name" properties along with tissue type object of all cell lines in the database', done => {
        request(server)
            .post('/graphql')
            .send({ query: cellQueries.multipleCellsTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { cell_lines } = res.body.data;
                expect(cell_lines).to.be.an('array').that.have.lengthOf.above(0);
                cell_lines.every(cell => {
                    expect(cell).to.have.all.keys('id', 'name', 'tissue');
                    const { id, name, tissue } = cell;
                    expect(id).to.be.a('number');
                    expect(name).to.be.string;
                    expect(tissue).to.be.an('object');
                    expect(tissue.id).to.be.a('number');
                    expect(tissue.name).to.be.string;
                });
                return done();
            });
    });

    // Tests a single cell line. The cell line belongs to CellLineAnntotation graphql type
    it('Returns a cell_line annotation object based on the id input', done => {
        request(server)
            .post('/graphql')
            .send({ query: cellQueries.singleCellTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { cell_line } = res.body.data;
                const { id, name, tissue, synonyms } = cell_line;

                expect(cell_line).to.have.all.keys('id', 'name', 'tissue', 'synonyms');
                expect(id).to.be.a('number');
                expect(name).to.be.string;

                // checks tissue object
                expect(tissue).to.be.an('object');
                expect(tissue.id).to.be.a('number');
                expect(tissue.name).to.be.string;

                // checks synonyms array
                expect(synonyms).to.be.an('array').that.have.lengthOf.above(0);
                synonyms.every(synonym => {
                    expect(synonym).to.be.string;
                });

                return done();
            });
    });
};

module.exports = {
    test
};
