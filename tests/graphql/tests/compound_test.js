/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Compound API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const compoundQueries = require('../queries/compound_queries');

/**
 * A function that contains tests for compound.js.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
    
    it('Returns "id" and "name" properties of all compounds in the database', done => {
        request(server)
            .post('/graphql')
            .send({ query: compoundQueries.compoundsKeysTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { compounds } = res.body.data;
                compounds.every(compound =>
                    expect(compound).to.have.all.keys('id', 'name'));
                return done();
            });
    });

    it('Returns a compound object based on a compound ID input.', done => {
        request(server)
            .post('/graphql')
            .send({ query: compoundQueries.compoundKeysTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const compound = res.body.data.compound.compound;
                expect(compound).to.have.keys('id', 'name', 'annotation');
                expect(compound.annotation).to.have.keys('smiles', 'inchikey', 'pubchem');
                return done();
            });
    });

    it('Returns a compound object for paclitaxel.', done => {
        request(server)
            .post('/graphql')
            .send({ query: compoundQueries.compoundQueryPaclitaxel })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const compound = res.body.data.compound.compound;
                expect(compound.id).to.equal(526);
                expect(compound.name).to.equal('paclitaxel');
                return done();
            });
    });

};

module.exports= {
    test
};
