// BaseClass
const BaseClass = require('./BaseClass')

/**
 * TestSuite(obj)
 * @param {String} obj.name
 * @param {Array} obj.tests
 * @param {Function} obj.setup
 * @param {Function} obj.tearDown
 */
class TestSuite extends BaseClass {
    /**
     * Run all tests in suite
     */
    run() {
        if (this.setup) this.setup()
        console.log(`******* ${this.name} *******\n`)
        this.tests.forEach((test, i) => {
            console.log(`${i + 1} - ${test.name}:\n`)
            test.code()
            if (i < (this.tests.length - 1)) console.log('\n')
        })
        console.log(`***** End ${this.name} *****\n`)
        if (this.tearDown) this.tearDown()
    }
}

module.exports = TestSuite;