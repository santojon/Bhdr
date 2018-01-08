// Require classes
const Bhdr = require('../../dist/lib/Bhdr').Bhdr
const TestSuite = require('../base/TestSuite')

// Create bhdr to save tests into
var bhdr = new Bhdr(this)
bhdr.map(TestSuite)

// Get test suites
const base = require('./suites/base')
const save = require('./suites/save')
const finders = require('./suites/finders')

/********************************************
 * Running Tests
 ********************************************/

base.run()
save.run()
finders.run()

// Save test suites
base.save(() => {
    save.save(() => {
        finders.save(() => {
            console.log('Bhdr:', bhdr.export('json', 2))
        })
    })
})