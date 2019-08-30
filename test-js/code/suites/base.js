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
    name: 'Bhdr Base Tests',
    setup: () => {
        this.pool = new Bhdr(this)
    },
    tests: [
        new Test({
            name: 'Test instanceof',
            code: () => {
                console.log(this.pool.instanceof(Bhdr))
            }
        }),
        new Test({
            name: 'Test export',
            code: () => {
                console.log('Pool:', this.pool.export('json', 2))
            }
        }),
        new Test({
            name: 'Test createTable',
            code: () => {
                this.pool.createTable(
                    User,
                    () => {
                        console.log('Pool:', this.pool.export('json', 2))
                    }
                )
            }
        }),
        new Test({
            name: 'Test dropTable',
            code: () => {
                this.pool.dropTable(
                    User,
                    () => {
                        console.log('Pool:', this.pool.export('json', 2))
                    }
                )
            }
        }),
        new Test({
            name: 'Test insert',
            code: () => {
                this.pool.insert(
                    User,
                    new User({
                        name: 'Test User'
                    }),
                    () => {
                        console.log('Pool:', this.pool.export('json', 2))
                    }
                )
            }
        }),
        new Test({
            name: 'Test get',
            code: () => {
                console.log(this.pool.get(User, 1))
            }
        }),
        new Test({
            name: 'Test update',
            code: () => {
                this.pool.update(
                    User,
                    this.pool.get(User, 1),
                    new User({
                        name: 'Updated Test User'
                    }),
                    () => {
                        console.log('Pool:', this.pool.export('json', 2))
                    }
                )
            }
        }),
        new Test({
            name: 'Test map',
            code: () => {
                this.pool.map(User)
                console.log(User.get(1).id())
            }
        }),
        new Test({
            name: 'Test getId',
            code: () => {
                var user = User.get(1)
                console.log(user.id())
            }
        }),
        new Test({
            name: 'Test delete',
            code: () => {
                this.pool.delete(
                    User,
                    this.pool.get(User, 1),
                    () => {
                        console.log('Pool:', this.pool.export('json', 2))
                    }
                )
            }
        }),
        new Test({
            name: 'Test import',
            code: () => {
                this.pool.import(
                    '{\
                        "User": {\
                          "1": {\
                            "name": "Test User"\
                          },\
                          "id": 2\
                        }\
                    }',
                    'json'
                )
                console.log('Pool:', this.pool.export('json', 2))
            }
        })
    ],
    tearDown: () => {
        this.pool.reset()
        console.log('Pool:', this.pool.export('json', 2))
    }
})