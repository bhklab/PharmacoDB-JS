/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Compound API endpoints.
 */
const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const compoundQueries = require("../queries/compound_queries");

/**
 * A function that contains tests for compound.js.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {
  // test for all compound route. Checks Compound Graphql type
  it('Returns "id" and "name" properties of all compounds in the database', function (done) {
    this.timeout(10000);
    request(server)
      .post("/graphql")
      .send({ query: compoundQueries.multipleCompoundsTestQuery })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const { compounds } = res.body.data;
        // expects to see an array of at least 500
        expect(compounds).to.be.an("array").that.have.lengthOf.at.least(500);
        // checks individual compounds in the list
        compounds.every((compound) => {
          const { id, name, annotation } = compound;
          expect(compound).to.have.all.keys("id", "name", "annotation");
          expect(id).to.be.a("number");
          expect(name).to.be.string;
          expect(annotation).to.be.an("object");
          expect(annotation).to.have.all.keys(
            "smiles",
            "inchikey",
            "pubchem",
            "fda_status"
          );
        });
        return done();
      });
  });

  // test for all compound route. Checks SingleCompound Graphql type
  it("Returns a compound object based on a compound ID input.", (done) => {
    request(server)
      .post("/graphql")
      .send({ query: compoundQueries.singleCompoundTestQuery })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const { compound } = res.body.data;

        // checks returned data at higher level
        expect(compound).to.have.keys("compound", "synonyms", "targets");

        // checks compound object of a SingleCompound type
        expect(compound.compound)
          .to.be.an("object")
          .that.has.all.keys("id", "name", "annotation");
        const { id, name, annotation } = compound.compound;
        expect(id).to.be.a("number");
        expect(name).to.be.string;
        expect(annotation)
          .to.be.an("object")
          .that.has.all.keys("smiles", "inchikey", "pubchem", "fda_status");
        const { smiles, inchikey, pubchem, fda_status } = annotation;
        expect(smiles).to.be.string;
        expect(inchikey).to.be.string;
        expect(pubchem).to.be.string;
        expect(fda_status).to.be.oneOf(["Approved", "Not Approved"]);

        const { synonyms, targets } = compound;

        // checks the format of list of targets
        expect(targets).to.be.an("array").that.have.lengthOf.above(0);
        targets.every((target) => {
          expect(target).to.have.all.keys("id", "name");
          expect(target.id).to.be.a("number");
          expect(target.name).to.be.string;
        });

        // checks synonyms array
        expect(synonyms).to.be.an("array").that.have.lengthOf.above(0);
        synonyms.every((synonym) => {
          expect(synonym)
            .to.be.an("object")
            .that.has.all.keys("name", "source");
          expect(synonym.name).to.be.string;
          expect(synonym.source).to.be.an("array").that.has.lengthOf.above(0);
        });

        return done();
      });
  });

  it("Returns a compound object for paclitaxel.", (done) => {
    request(server)
      .post("/graphql")
      .send({ query: compoundQueries.paclitaxelCompoundTestQuery })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const compound = res.body.data.compound.compound;
        expect(compound.id).to.equal(641);
        expect(compound.name).to.equal("Paclitaxel");
        return done();
      });
  });
};

module.exports = {
  test,
};
