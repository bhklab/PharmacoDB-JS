/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Gene API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const geneQueries = require('../queries/gene_queries');

/**
 * A function that contains tests for gene.js.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {

    // test for all genes route
    it('Returns list of all genes with "id", "name" and "annotation" properties. Annotation object must contain required "gene_id" property', done => {
        request(server)
            .post('/graphql')
            .send({ query: geneQueries.multipleGenesTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                res.body.data.genes.every(gene => {
                    expect(gene).to.have.all.keys('id', 'name', 'annotation');
                    expect(gene.id).to.be.a('number');
                    expect(gene.name).to.be.string;
                    expect(gene.annotation).to.be.an('object');
                    expect(gene.annotation).to.have.property('gene_id');
                });
                return done();
            });
    });

    // test for a single gene route
    it('Returns "id", "name" properties of the first gene in the database along with "annotation" object that contains "gene_id", "ensg", "gene_seq_start", "gene_seq_end"', done => {
        request(server)
            .post('/graphql')
            .send({ query: geneQueries.singleGeneTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { gene } = res.body.data;
                expect(gene).to.have.all.keys('id', 'name', 'annotation');
                expect(gene.id).to.be.a('number');
                expect(gene.name).to.be.string;
                expect(gene.annotation).to.be.an('object');
                expect(gene.annotation).to.have.all.keys('gene_id', 'ensg', 'gene_seq_start', 'gene_seq_end');
                return done();
            });
    });
};

module.exports = {
    test
};
