// Require bhdr
const Bhdr = require('../../../dist/bhdr')

// Used in this scope
const User = require('../../base/User')
const Test = require('../../base/Test')
const TestSuite = require('../../base/TestSuite')

/**
 * The suite to run
 */
module.exports =  new TestSuite({
    name: 'Bhdr Finders Tests',
    setup: () => {
        this.pool = new Bhdr(this)
        this.pool.map(User)
        'this is a test'.split('').forEach((s, i) => {
            var char
            if ((i % 2) === 0){
                char = 'T'
            }
            else {
                char = 't'
            }

            new User({
                name: `Test ${i}`,
                username: `${char}est${i}`,
            }).save()
        })
    },
    tests: [
        new Test({
            name: 'Test Find User',
            code: () => {
                console.log(User.find({ username: 'test1'}))
            }
        }),
        new Test({
            name: 'Test Find Users By (case sensitive)',
            code: () => {
                console.log(User.findBy({ username: 'test1'}))
            }
        }),
        new Test({
            name: 'Test Find Users By (case insensitive)',
            code: () => {
                console.log(User.findByI({ username: 'test2'}))
            }
        }),
        new Test({
            name: 'Test Find Users Like (case sensitive)',
            code: () => {
                console.log(User.findByLike({ username: 'test1'}))
            }
        }),
        new Test({
            name: 'Test Find Users Like (case insensitive)',
            code: () => {
                console.log(User.findByILike({ username: 'test1'}))
            }
        }),
        new Test({
            name: 'Test Find Where',
            code: () => {
                console.log(User.findWhere((user) => {
                    return (user.name.length > 6)
                }))
            }
        }),
        new Test({
            name: 'Test Find All Users',
            code: () => {
                console.log(User.findAll())
            }
        })
    ],
    tearDown: () => {
        console.log('Pool:', this.pool.export('json', 2))
    }
})