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

    it('Returns "id" and "name" properties of all cell lines in the database', done => {
        request(server)
            .post('/graphql')
            .send({ query: cellQueries.cellsKeysTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                res.body.data.cell_lines.every(cell =>
                    expect(cell).to.have.all.keys('id', 'name'));
                return done();
            });
    });

    // it('Returns a cell_line object based on the id input', done => {
    //     request(server)
    //         .post('/graphql')
    //         .send({ query: cellQueries.cellKeysTestQuery })
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             const cell_line = res.body.data.cell_line.cell_line;
    //             expect(cell_line).to.have.keys('id', 'name', 'tissue');
    //             expect(cell_line.tissue).to.have.keys('id', 'name');
    //             return done();
    //         });
    // });
};

module.exports = {
    test
};
