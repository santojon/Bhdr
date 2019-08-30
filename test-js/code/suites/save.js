// Require bhdr
const Bhdr = require('../../../dist/lib/Bhdr')

// Used in this scope
const User = require('../../base/User')
const Test = require('../../base/Test')
const TestSuite = require('../../base/TestSuite')

/**
 * The suite to run
 */
module.exports =  new TestSuite({
    name: 'Bhdr Save Tests',
    setup: () => {
        this.pool = new Bhdr(this)
        this.pool.map(User)
    },
    tests: [
        new Test({
            name: 'Save one user',
            code: () => {
                // User
                var u = new User({
                    name: 'Jonathan Santos',
                    username: 'santojon'
                })

                u.save((user) => {
                    console.log(`User ${user.name} saved!\n`)
                })
            }
        }),
        new Test({
            name: 'Save many users',
            code: () => {
                // User1
                var u1 = new User({
                    name: 'Alfredo Baptiste',
                    username: 'abapt'
                })

                // User2
                var u2 = new User({
                    name: 'Test User',
                    username: 'test'
                })

                // Immediate
                u1.save((user) => {
                    console.log(`User ${user.name} saved!\n`)
                })

                u2.save((user) => {
                    console.log(`User ${user.name} saved!\n`)
                })
            }
        })
    ],
    tearDown: () => {
        console.log('Pool:', this.pool.export('json', 2))
    }
})