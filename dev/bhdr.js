// needed variables
var data = new Object()
var baseId = 1
var container = {}

/**
 * Class that represents a data pool
 * Made to simulate an in-memory database
 */
class Bhdr {
    /**
     * Class constructor
     * @param {Object} container: Container to create Bhdr Object (Optional if in window)
     * @param {Object} options: Database options (Optional) [TODO]
     */
    constructor(container, options) {
        container = container || window
        return this.reset()
    }

    /**
     * Function responsible to reinitialize the pool
     */
    reset() {
        baseId = 1
        data = new Object()
        return this
    }
        
    /**
     * Function to validate instance of Bhdr
     * @param {Function} klass: A Class to verify if is Bhdr
     */
    instanceof(klass) {
        return (klass.prototype.constructor.name === 'Bhdr')
    }

    /**
     * Create a table if it not exists
     * @param {Function} klass: the class of the objects of the table
     * @param {Function} callback: an optional callback function to run after creation
     */
    createTable(klass, callback) {
        var cname = klass.prototype.constructor.name
        if (!data[cname]) {
            data[cname] = { id: baseId }
            return callback ? callback(data[cname]) : data[cname]
        }

        return data[cname]
    }

    /**
     * Drop a table if it not exists
     * @param {Function} klass: the class of the objects of the table
     * @param {Function} callback: an optional callback function to run before drop
     */
    dropTable(klass, callback) {
        var cname = klass.prototype.constructor.name
        if (data[cname]) {
            if (callback) {
                callback(data[cname])
            }
            delete data[cname]
        }

        return null
    }

    /**
     * Function used to add new instances into 'database'
     * @param {Function} klass: the class of the object to add
     * @param {Object} obj: the object to add into 'database'
     * @param {Function} callback: an optional callback function to run after insert
     */
    insert(klass, obj, callback) {
        var cname = klass.prototype.constructor.name
        if (!data[cname]) {
            data[cname] = {}
        }

        if (obj instanceof klass) {
            data[cname][autoIncrementableId(klass)] = obj
            return callback ? callback(obj) : obj
        }

        return obj
    }

    /**
     * Function used to update instances in 'database'
     * @param {Function} klass: the class of the object to add
     * @param {Object} obj: the object to update in 'database'
     * @param {Object} newObj: the new object
     * @param {Function} callback: an optional callback function to run after insert
     */
    update(klass, obj, newObj, callback) {
        var cname = klass.prototype.constructor.name
        if (!data[cname]) {
            return null
        } else {
            if (obj instanceof klass) {
                data[cname][this.getId(klass, obj)] = newObj
                return callback ? callback(newObj) : newObj
            }

            return obj
        }
    }

    /**
     * Function used to remove instances from 'database'
     * @param {Function} klass: the class of the object to remove
     * @param {Object} obj: the object to remove from 'database'
     * @param {Function} callback: an optional callback function to run after delete
     */
    delete(klass, obj, callback) {
        var cname = klass.prototype.constructor.name

        if (data[cname]) {
            if (obj instanceof klass) {
                Object.keys(data[cname]).forEach(
                    (key) => {
                        if (data[cname][key] === obj) {
                            delete data[cname][key]
                            return callback ? callback(obj) : obj
                        }
                    }
                )
            }
        }

        return obj
    }

    /**
     * Function used to find the first instance in 'database' with exact values
     * @param {Function} klass: the class of the object to find
     * @param {Object} opt: the options used to find
     */
    find(klass, opt) {
        var result = this.findBy(klass, opt) || []
        return (result.length > 0) ? result[0] : null
    }

    /**
     * Function used to find instances in 'database' with exact values
     * @param {Function} klass: the class of the object to find
     * @param {Object} opt: the options used to find
     */
    findBy(klass, opt) {
        var cname = klass.prototype.constructor.name
        var result = []

        if (data[cname]) {
            Object.keys(opt).forEach(
                (key) => {
                    Object.keys(data[cname]).forEach(
                        (k) => {
                            if (data[cname][k][key] &&
                                    (data[cname][k][key] === opt[key])) {
                                result.push(data[cname][k])
                            }
                        }
                    )
                }
            )
        }

        return result
    }

    /**
     * Function used to find instances in 'database' with exact values (case insensitive)
     * @param {Function} klass: the class of the object to find
     * @param {Object} opt: the options used to find
     */
    findByI(klass, opt) {
        var cname = klass.prototype.constructor.name
        var result = []

        if (data[cname]) {
            Object.keys(opt).forEach(
                (key) => {
                    Object.keys(data[cname]).forEach(
                        (k) => {
                            if (data[cname][k][key] &&
                                    (data[cname][k][key].toString()
                                            .toLowerCase() === opt[key]
                                                .toString().toLowerCase())) {

                                result.push(data[cname][k])
                            }
                        }
                    )
                }
            )
        }

        return result
    }

    /**
     * Function used to find instances in 'database' with similar values
     * @param {Function} klass: the class of the object to find
     * @param {Object} opt: the options used to find
     */
    findByLike(klass, opt) {
        var cname = klass.prototype.constructor.name
        var partial = []
        var aux = []

        var result = []

        Object.keys(data[cname]).forEach(
            (k) => {
                if (k !== 'id') {
                    partial.push(data[cname][k])
                }
            }
        )

        if (data[cname]) {
            Object.keys(opt).forEach(
                (key) => {
                    partial.forEach(
                        (k) => {
                            if (k[key]) {
                                if (k[key].toString()
                                        .indexOf(opt[key].toString()) !== -1) {

                                    aux.push(k)
                                }
                            }
                        }
                    )
                    partial = aux
                    aux = []
                }
            )
            result = partial
        }

        return result
    }

    /**
     * Function used to find instances in 'database' with similar values (case insensitive)
     * @param {Function} klass: the class of the object to find
     * @param {Object} opt: the options used to find
     */
    findByILike(klass, opt) {
        var cname = klass.prototype.constructor.name
        var partial = []
        var aux = []

        var result = []

        Object.keys(data[cname]).forEach(
            (k) => {
                if (k !== 'id') {
                    partial.push(data[cname][k])
                }
            }
        )

        if (data[cname]) {
            Object.keys(opt).forEach(
                (key) => {
                    partial.forEach(
                        (k) => {
                            if (k[key]) {
                                if (k[key].toString().toLowerCase()
                                        .indexOf(opt[key].toString().toLowerCase()) !== -1) {

                                    aux.push(k)
                                }
                            }
                        }
                    )
                    partial = aux
                    aux = []
                }
            )
            result = partial
        }

        return result
    }

    /**
     * Function used to find all instances in 'database'
     * @param {Function} klass: the class of the objects to find
     */
    findAll(klass) {
        var cname = klass.prototype.constructor.name
        var result = []

        if (data[cname]) {
            Object.keys(data[cname]).forEach(
                (k) => {
                    if (k !== 'id') {
                        result.push(data[cname][k])
                    }
                }
            )
        }

        return result
    }

    /**
     * Find using strict function as condition
     * @param {Function} klass: the class of the objects to find
     * @param {Function} rfunc: boolean function to validate object
     */
    findWhere(klass, rfunc) {
        var cname = klass.prototype.constructor.name
        var result = []

        if (data[cname]) {
            Object.keys(data[cname]).forEach(
                (k) => {
                    if (k !== 'id') {
                        if (rfunc(data[cname][k])) {
                            result.push(data[cname][k])
                        }
                    }
                }
            )
        }

        return result
    }

    /**
     * Map the Bhr main functions in class
     * @param {Function} klass: the class to map
     */
    map() {
        var args = Array.prototype.slice.call(arguments)
        if (args && args.length > 0) {
            args.forEach((klass) => {
                klass.add = (obj, callback) => {
                    return this.insert(klass, obj, callback)
                }

                klass.update = (obj, newObj, callback) => {
                    return this.update(klass, obj, newObj, callback)
                }

                klass.remove = (obj, callback) => {
                    return this.delete(klass, obj, callback)
                }

                klass.find = (opt) => {
                    return this.find(klass, opt)
                }

                klass.findBy = (opt) => {
                    return this.findBy(klass, opt)
                }

                klass.findByI = (opt) => {
                    return this.findByI(klass, opt)
                }

                klass.findByLike = (opt) => {
                    return this.findByLike(klass, opt)
                }

                klass.findByILike = (opt) => {
                    return this.findByILike(klass, opt)
                }

                klass.findAll = () => {
                    return this.findAll(klass)
                }

                klass.findWhere = (rfunc) => {
                    return this.findWhere(klass, rfunc)
                }

                klass.get = (id) => {
                    return this.get(klass, id)
                }

                klass.getId = (obj) => {
                    return this.getId(klass, obj)
                }

                klass.prototype.save = (callback) => {
                    return klass.add(this, callback)
                }

                klass.prototype.delete = (callback) => {
                    return klass.remove(this, callback)
                }

                klass.prototype.update = (newObj, callback) => {
                    return klass.update(this, newObj, callback)
                }

                klass.prototype.id = () => {
                    return klass.getId(this)
                }

                klass.createTable = (callback) => {
                    return this.createTable(klass, callback)
                }

                klass.dropTable = (callback) => {
                    return this.dropTable(klass, callback)
                }

                // Add mapping for all properties in objects to array (if inexistent)
                Object.keys(klass.prototype).forEach((k) => {
                    Array.prototype[k] = Array.prototype[k] || (() => {
                        if (this[0]) {
                            if (this[0]['instanceof']) {
                                if (this[0]['instanceof'](klass)) {
                                    return this.map((x) => { return x[k] })
                                }
                            } else {
                                if (this[0] instanceof klass) {
                                    return this.map((x) => { return x[k] })
                                }
                            }
                        }
                        return []
                    })
                })

                return klass
            })
        }
    }

    /**
     * Function used get the 'entity' with the given class and id
     * @param {Function} klass: the class of the object to get
     * @param {Number} id: the id of the object in Bhdr
     */
    get(klass, id) {
        var cname = klass.prototype.constructor.name

        if (data[cname]) {
            return data[cname][id] || null
        } else {
            return null
        }
    }

    /**
     * Get the id of element in database
     * @param {Function} klass: the related class
     * @param {Object} obj: the object to get the id of
     */
    getId(klass, obj) {
        var cname = klass.prototype.constructor.name

        if (data[cname]) {
            var res = []

            Object.keys(data[cname]).forEach((key) => {
                if (data[cname][key] === obj) res.push(key)
            })

            return (res.length > 0) ? res[0] : null
        } else {
            return null
        }
    }

    /**
     * Function used to export 'database' to given type
     * @param {String} type: the type to export, as string
     * @param {Number} ident: [Optional] (JSON ONLY!) the identation spaces, as number
     */
    export(type, ident) {
        var result

        switch (type) {
            case 'javascript':
                result = data
                break
            case 'json':
                if (ident) {
                    result = JSON.stringify(data, null, ident)
                } else {
                    result = JSON.stringify(data)
                }
                break
            case 'bwf':
                var main = JSON.stringify(data)
                        .trim().split(/"/).join(' ')
                            .split(/{/).join(' { ')
                                .split(/}/).join(' } ')
                                    .split(/\[/).join(' \[ ')
                                        .split(/\]/).join(' \] ')
                                            .split(/ :/).join(': ')
                                                .split(/ ,/).join(', ')
                                                    .split(/  /).join(' ').trim()
                result = 'Bhdr: ' + main
                break
        }

        return result
    }

    /**
     * Function used to import 'database' from given type
     * @param {String} type: the type to import, as string
     * @param {Object} db: the 'database' to import
     */
    import(db, type) {
        var result = false

        switch (type) {
            case 'javascript':
                data = db
                result = true
                break
            case 'json':
                var p = new Object()
                var j = JSON.parse(db)

                // For each 'table'
                Object.keys(j).forEach((k) => {
                    p[k] = new Object()

                    // For each object in 'table'
                    Object.keys(j[k]).forEach((key) => {
                        if (key === 'id') {
                            p[k][key] = j[k][key]
                        } else {
                            // create an object
                            if (container[k]) {
                                p[k][key] = new container[k]({})
                            } else {
                                p[k][key] = new Object()
                            }
                            setupClass(p[k][key], j[k][key], container[k])
                        }
                    })
                })

                this.import(p, 'javascript')
                result = true
                break
        }
        
        return result
    }
}

/************************************
 * Auxiliar functions
 ************************************/

/**
 * 
 * @param {*} to 
 * @param {*} from 
 * @param {*} mainClass 
 */
const setupClass = (to, from, mainClass) => {
    Object.keys(from).forEach((k) => {
        // sub-objects
        if ((from[k] instanceof Object) && !(from[k] instanceof Array)) {
            // Bwf made classes have this property (or you can inject)
            // the types for each property in top-level class
            if (mainClass['__types']) {
                // the current key has a defined type
                if (mainClass.__types[k]) {
                    to[k] = new mainClass.__types[k]({})

                    // go deeper in sub-objects
                    setupClass(to[k], from[k], mainClass.__types[k])
                } else {        // type not defined
                    to[k] = from[k]
                }
            } else {        // no '__types' property
                to[k] = from[k]
            }
        } else if (from[k] instanceof Array) {
            to[k] = new Array()
            // TODO: import typed arrays
            from[k].forEach((ff) => {
                // Bwf made have this property (or you can inject)
                // the types for each property in top-level object
                if (mainClass['__types']) {
                    // the current key has a defined type
                    if (mainClass.__types[k]) {
                        // and is a list
                        if (mainClass.__types[k] instanceof Array) {
                            // not empty
                            if (mainClass.__types[k].length > 0) {
                                to[k].push(new mainClass.__types[k][0](ff))

                                // go deeper in sub-objects
                                setupClass(to[k].last(), ff, mainClass.__types[k][0])
                            } else {        // empty array type
                                to[k] = ff
                            }
                        } else {        // not an array
                            to[k] = ff
                        }
                    } else {        // type not defined
                        to[k] = ff
                    }
                } else {        // no '__types' property
                    to[k] = from[k]
                }
            })
        } else {        // simple properties
            to[k] = from[k]
        }
    })
}

/**
 * Increments the id of a 'table'
 * @param {Function} klass: A Class to get name of the 'table'
 */
const autoIncrementableId = (klass) => {
    var cname = klass.prototype.constructor.name

    if (data[cname]) {
        if (data[cname].id) {
            data[cname].id = data[cname].id + 1
        } else {
            data[cname]['id'] = baseId
        }
    } else {
        data[cname] = { id: baseId }
    }

    return data[cname].id
}

/****************************************
 * Array extra functions (for Bhdr needs)
 ****************************************/
(() => {
    /**
     * Remove a value from array (all occurences)
     * @param val: the value to remove
     */
    Array.prototype.remove = (val) => {
        var i = this.indexOf(val)
        return (i > -1) ? this.splice(i, 1) : this
    }

    /**
     * Remove all duplicated values from array
     */
    Array.prototype.distinct = () => {
        return this.sort().filter((item, pos, array) => {
            return !pos || item != array[pos - 1]
        })
    }

    /**
     * Alias for 'lenght'
     */
    Array.prototype.count = () => {
        return this.length || 0
    }

    /**
     * Order an array of objects by fields
     * @param field: the field to order by
     * @param order: true to order descending
     * @param rfunc: function to restrict compairson scope (if needed)
     */
    Array.prototype.orderBy = (field, order, rfunc) => {
        var key = rfunc ?
            (x) => { return rfunc(x[field]) } :
            (x) => { return x[field] }

        order = (order === 'desc') ? -1 : 1

        return this.sort((a, b) => {
            return a = key(a), b = key(b), order * ((a > b) - (b > a))
        })
    }

    /**
     * Calculate average of numeric fields
     * @param field: the field to calculate avg
     */
    Array.prototype.avg = (field) => {
        if (this.count() > 0) {
            var r = []
            this.forEach((k) => {
                r.push(k[field])
            })

            return r.reduce((a, b) => { return a + b }) / this.count()
        }
        return 0
    }

    /**
     * Get last element from list
     */
    Array.prototype.last = () => {
        return this[this.count() - 1]
    }

    /**
     * Get first element from list
     */
    Array.prototype.first = () => {
        return this[0]
    }

    /**
     * First element as an array
     */
    Array.prototype.head = () => {
        return this.length > 0 ? [this[0]] : null
    }

    /**
     * Last element as an array
     */
    Array.prototype.lst = () => {
        return this.length > 0 ? [this[this.length - 1]] : null
    }

    /**
     * The tail of the list (all but first element)
     */
    Array.prototype.tail = () => {
        var a = this
        if (a.length > 0) this.shift()
        return a
    }

    /**
     * The init of the list (all but last element)
     */
    Array.prototype.init = () => {
        var a = this
        if (a.length > 0) this.pop()
        return a
    }
})()

module.exports = Bhdr