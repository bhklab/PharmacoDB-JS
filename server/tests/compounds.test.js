const app = require('../app'); // import NodeJS app
const chai = require('chai');

const expect = chai.expect;

// Load supertest object with app.
const request = require('supertest')(app);

let failures = [];
let successes = [];

describe('Test: Compounds API', () => {
    // Log test result after each test.
    afterEach(function() {
        const title = this.currentTest.title;
        const state = this.currentTest.state;
        if (state === 'passed') {
            successes.push(title);
        } else if (state === 'failed') {
            failures.push(title);
        }
    });

    // Terminate the server after all the tests are done.
    after(() => {
        if (failures.length) {
            console.log(
                'The following ' + failures.length + ' test(s) failed: '
            );
            failures.forEach(f => console.log('\t' + f));
            process.exit(1);
        } else {
            console.log('Passed all ' + successes.length + ' test(s).');
            process.exit(0);
        }
    });

    it('Returns "id" and "name" properties of all compounds in the database', done => {
        request
            .post('/graphql')
            .send({ query: '{ compounds { id name } }' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                res.body.data.compounds.every(compound =>
                    expect(compound).to.have.all.keys('id', 'name')
                );
                return done();
            });
    });
});
