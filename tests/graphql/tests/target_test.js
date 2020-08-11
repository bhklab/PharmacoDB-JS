/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Tissue API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const targetQueries = require('../queries/target_queries');

/**
 * A function that contains tests for target.js.
 * This function is exported, and called in graphql.test.js.
 */

const test = (server) => {
    it('Returns "id" and "name" properties for a given compound and list of its targets', done => {
        request(server)
            .post('/graphql')
            .send({ query: targetQueries.targetTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { compound_target } = res.body.data;
                const { compound_id, compound_name, targets } = compound_target;
                expect(compound_target).to.have.all.keys('compound_id', 'compound_name', 'targets');
                expect(compound_id).to.be.a('number');
                expect(compound_name).to.be.string;
                
                // checks the format of target object
                expect(targets).to.be.an('array').that.have.lengthOf.above(0);
                targets.every(target => {
                    expect(target).to.have.all.keys('id', 'name');
                    expect(target.id).to.be.a('number');
                    expect(target.name).to.be.string;
                });
                return done();
            });
    });
};

module.exports = {
    test
};