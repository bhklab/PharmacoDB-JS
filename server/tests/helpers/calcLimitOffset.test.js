/**
 * Unit tests for functions in calclimitOffset module.
 * An example test file for non-API unit tests.
 */

const chai = require('chai');
const expect = chai.expect;

// Import the module to be tested.
const calcLimitOffset = require('../../helpers/calcLimitOffset')

describe('Tests: calcLimitOffset module', () => {
    // declare variables used in this test block.
    before(function(){
        this.failures = [];
        this.successes = [];
    })

    after(function() {
        if (this.failures.length) {
            console.log('\tHelper: The following ' + this.failures.length + ' test(s) failed:');
            this.failures.forEach(f => console.log('\t\t' + f));
        } else {
            console.log('\tHelper: Passed all ' + this.successes.length + ' test(s).');
        }
    });

    describe('calcLimitOffset function', () => {
        // Log test result after each test.
        afterEach(function() {
            if (this.currentTest.state === 'passed') {
                this.successes.push(this.currentTest.title);
            } else if (this.currentTest.state === 'failed') {
                this.failures.push(this.currentTest.title);
            }
        });

        it('Returns a number of rows per page and an offset value.', done => {
            let result = calcLimitOffset.calcLimitOffset(5, 10);
            expect(result).to.deep.equal({limit: 10, offset: 40});
            done();
        });
    });
})