const chai = require('chai');

const expect = chai.expect;
const url = 'http://localhost:5000';
const request = require('supertest')(url);

describe('Compounds GraphQL API', () => {
    it('Returns "id" and "name" properties of all compounds in the database', (done) => {
        request.post('/graphql')
        .send({query: '{ compounds { id name } }'})
        .expect(200)
        .end((err, res) => {
            if(err) return done(err);
            res.body.data.compounds.every(compound => expect(compound).to.have.all.keys('id', 'name'));
            return done()
        })
    })
})