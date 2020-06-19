const app = require('../app'); // import NodeJS app
const chai = require('chai');

const expect = chai.expect;

// Load supertest object with app.
const request = require('supertest')(app);

describe('Test: Compounds API', () => {
    
    // Terminate the server after all the tests are done.
    after(() => {
        process.exit(0)
    })

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