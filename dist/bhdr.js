/**
 * Class that simulate a database
 * @param {Object} container: [optional] container: the container object to put classes in (default is window)
 * @param {Object} options:[optional] options: Database options
 */
function Bhdr(container, options) {
    // needed variables
    var pool = this
    var data = new Object()
    var baseId = 1
    var container = container || window

    // The pool itself
    pool.prototype = {
        /**
         * Function responsible to (re)initialize the pool
         */
        reset: function() {
            baseId = 1
            data = new Object()
            return this
        },
        /**
	     * Function to validate instance of Bhdr
         * @param {Function} klass: the class to test
	     */
	    instanceof: function(klass) {
	        return (klass.prototype.constructor.name === 'Bhdr')
	    },
        /**
         * Create a table if it not exists
         * @param {Function} klass: the class of the objects of the table
         * @param {Function} callback: an optional callback function to run after creation
         */
        createTable: function(klass, callback) {
            var cname = klass.prototype.constructor.name
            if (!data[cname]) {
                data[cname] = { id: baseId }
                return callback ? callback(data[cname]) : data[cname]
            }

            return data[cname]
        },
        /**
         * Drop a table if it exists
         * @param {Function} klass: the class of the objects of the table
         * @param {Function} callback: an optional callback function to run before drop
         */
        dropTable: function(klass, callback) {
            var cname = klass.prototype.constructor.name
            if (data[cname]) {
                if (callback) {
                    callback(data[cname])
                }
                delete data[cname]
            }

            return null
        },
        /**
         * Function used to add new instances into 'database'
         * @param {Function} klass: the class of the object to add
         * @param {Object} obj: the object to add into 'database'
         * @param {Function} callback: an optional callback function to run after insert
         */
        insert: function(klass, obj, callback) {
            var cname = klass.prototype.constructor.name
            if (!data[cname]) {
                data[cname] = {}
            }

            if (obj instanceof klass) {
                data[cname][autoIncrementableId(klass)] = obj
                return callback ? callback(obj) : obj
            }

            return obj
        },
        /**
         * Function used to update instances in 'database'
         * @param {Function} klass: the class of the object to add
         * @param {Object} obj: the object to update in 'database'
         * @param {Object} newObj: the new object
         * @param {Function} callback: an optional callback function to run after insert
         */
        update: function(klass, obj, newObj, callback) {
            var cname = klass.prototype.constructor.name
            if (!data[cname]) {
                return null
            } else {
                if (obj instanceof klass) {
                    data[cname][pool.prototype.getId(klass, obj)] = newObj
                    return callback ? callback(newObj) : newObj
                }

                return obj
            }
        },
        /**
         * Function used to remove instances from 'database'
         * @param {Function} klass: the class of the object to remove
         * @param {Object} obj: the object to remove from 'database'
         * @param {Function} callback: an optional callback function to run after delete
         */
        delete: function(klass, obj, callback) {
            var cname = klass.prototype.constructor.name

            if (data[cname]) {
                if (obj instanceof klass) {
                    Object.keys(data[cname]).forEach(
                        function(key) {
                            if (data[cname][key] === obj) {
                                delete data[cname][key]
                                return callback ? callback(obj) : obj
                            }
                        }
                    )
                }
            }

            return obj
        },
        /**
         * Function used to find the first instance in 'database' with exact values
         * @param {Function} klass: the class of the object to find
         * @param {Object} opt: the options used to find
         */
        find: function(klass, opt) {
            var result = pool.prototype.findBy(klass, opt) || []
            return (result.length > 0) ? result[0] : null
        },
        /**
         * Function used to find instances in 'database' with exact values
         * @param {Function} klass: the class of the object to find
         * @param {Object} opt: the options used to find
         */
        findBy: function(klass, opt) {
            var cname = klass.prototype.constructor.name
            var result = []

            if (data[cname]) {
                Object.keys(opt).forEach(
                    function(key) {
                        Object.keys(data[cname]).forEach(
                            function(k) {
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
        },
        /**
         * Function used to find instances in 'database' with exact values (case insensitive)
         * @param {Function} klass: the class of the object to find
         * @param {Object} opt: the options used to find
         */
        findByI: function(klass, opt) {
            var cname = klass.prototype.constructor.name
            var result = []

            if (data[cname]) {
                Object.keys(opt).forEach(
                    function(key) {
                        Object.keys(data[cname]).forEach(
                            function(k) {
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
        },
        /**
         * Function used to find instances in 'database' with similar values
         * @param {Function} klass: the class of the object to find
         * @param {Object} opt: the options used to find
         */
        findByLike: function(klass, opt) {
            var cname = klass.prototype.constructor.name
            var partial = []
            var aux = []

            var result = []

            Object.keys(data[cname]).forEach(
                function(k) {
                    if (k !== 'id') {
                        partial.push(data[cname][k])
                    }
                }
            )

            if (data[cname]) {
                Object.keys(opt).forEach(
                    function(key) {
                        partial.forEach(
                            function(k) {
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
        },
        /**
         * Function used to find instances in 'database' with similar values (case insensitive)
         * @param {Function} klass: the class of the object to find
         * @param {Object} opt: the options used to find
         */
        findByILike: function(klass, opt) {
            var cname = klass.prototype.constructor.name
            var partial = []
            var aux = []

            var result = []

            Object.keys(data[cname]).forEach(
                function(k) {
                    if (k !== 'id') {
                        partial.push(data[cname][k])
                    }
                }
            )

            if (data[cname]) {
                Object.keys(opt).forEach(
                    function(key) {
                        partial.forEach(
                            function(k) {
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
        },
        /**
         * Function used to find all instances in 'database'
         * @param {Function} klass: the class of the objects to find
         */
        findAll: function(klass) {
            var cname = klass.prototype.constructor.name
            var result = []

            if (data[cname]) {
                Object.keys(data[cname]).forEach(
                    function(k) {
                        if (k !== 'id') {
                            result.push(data[cname][k])
                        }
                    }
                )
            }

            return result
        },
        /**
         * Find using strict function as condition
         * @param {Function} klass: the class of the objects to find
         * @param {Function} rfunc: boolean function to validate object
         */
        findWhere: function(klass, rfunc) {
            var cname = klass.prototype.constructor.name
            var result = []

            if (data[cname]) {
                Object.keys(data[cname]).forEach(
                    function(k) {
                        if (k !== 'id') {
                            if (rfunc(data[cname][k])) {
                                result.push(data[cname][k])
                            }
                        }
                    }
                )
            }

            return result
        },
        /**
         * Map the Bhr main functions in class
         * @param {Function} klass: the class to map
         */
        map: function() {
            var args = Array.prototype.slice.call(arguments)
            if (args && args.length > 0) {
                args.forEach(function(klass) {
                    klass.add = function(obj, callback) {
                        return pool.prototype.insert(klass, obj, callback)
                    }

                    klass.update = function(obj, newObj, callback) {
                        return pool.prototype.update(klass, obj, newObj, callback)
                    }

                    klass.remove = function(obj, callback) {
                        return pool.prototype.delete(klass, obj, callback)
                    }

                    klass.find = function(opt) {
                        return pool.prototype.find(klass, opt)
                    }

                    klass.findBy = function(opt) {
                        return pool.prototype.findBy(klass, opt)
                    }

                    klass.findByI = function(opt) {
                        return pool.prototype.findByI(klass, opt)
                    }

                    klass.findByLike = function(opt) {
                        return pool.prototype.findByLike(klass, opt)
                    }

                    klass.findByILike = function(opt) {
                        return pool.prototype.findByILike(klass, opt)
                    }

                    klass.findAll = function() {
                        return pool.prototype.findAll(klass)
                    }

                    klass.findWhere = function(rfunc) {
                        return pool.prototype.findWhere(klass, rfunc)
                    }

                    klass.get = function(id) {
                        return pool.prototype.get(klass, id)
                    }

                    klass.getId = function(obj) {
                        return pool.prototype.getId(klass, obj)
                    }

                    klass.prototype.save = function(callback) {
                        return klass.add(this, callback)
                    }

                    klass.prototype.delete = function(callback) {
                        return klass.remove(this, callback)
                    }

                    klass.prototype.update = function(newObj, callback) {
                        return klass.update(this, newObj, callback)
                    }

                    klass.prototype.id = function() {
                        return klass.getId(this)
                    }

                    klass.createTable = function(callback) {
                        return pool.prototype.createTable(klass, callback)
                    }

                    klass.dropTable = function(callback) {
                        return pool.prototype.dropTable(klass, callback)
                    }

                    // Add mapping for all properties in objects to array (if inexistent)
                    Object.keys(klass.prototype).forEach(function(k) {
                        Array.prototype[k] = Array.prototype[k] || function() {
                            if (this[0]) {
                                if (this[0]['instanceof']) {
                                    if (this[0]['instanceof'](klass)) {
                                        return this.map(function(x) { return x[k] })
                                    }
                                } else {
                                    if (this[0] instanceof klass) {
                                        return this.map(function(x) { return x[k] })
                                    }
                                }
                            }
                            return []
                        }
                    })

                    return klass
                })
            }
        },
        /**
         * Function used get the 'entity' with the given class and id
         * @param {Function} klass: the class of the object to get
         * @param {Number} id: the id of the object in Bhdr
         */
        get: function(klass, id) {
            var cname = klass.prototype.constructor.name

            if (data[cname]) {
                return data[cname][id] || null
            } else {
                return null
            }
        },
        /**
         * Get the id of element in database
         * @param {Function} klass: the related class
         * @param {Object} obj: the object
         */
        getId: function(klass, obj) {
            var cname = klass.prototype.constructor.name

            if (data[cname]) {
                var res = []

                Object.keys(data[cname]).forEach(function(key) {
                    if (data[cname][key] === obj) res.push(key)
                })

                return (res.count() > 0) ? res.first() : null
            } else {
                return null
            }
        },
        /**
         * Function used to export 'database' to given type
         * @param {String} type: the type to export, as string
         * @param {Number} ident: [Optional] (JSON ONLY!) the identation spaces, as number
         */
        export: function(type, ident) {
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
        },
        /**
         * Function used to import 'database' from given type
         * @param {String} type: the type to import, as string
         * @param {Object} db: the 'database' to import
         */
        import: function(db, type) {
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
                    Object.keys(j).forEach(function(k) {
                        p[k] = new Object()

                        // For each object in 'table'
                        Object.keys(j[k]).forEach(function(key) {
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

                    pool.prototype.import(p, 'javascript')
                    result = true
                    break
            }
            
            return result
        }
    }

    /**
     * Setup a class with all subclasses
     * @param {Object} to: where to put the result of class setup
     * @param {Object} from: generic object to create a setupped one with
     * @param {Function} mainClass: the class of the original top-level object (by tablename)
     */
    var setupClass = function(to, from, mainClass) {
        Object.keys(from).forEach(function(k) {
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
                from[k].forEach(function(ff) {
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
     * Function responsible to return an incremented id
     * @param {Function} klass: the class of the related id
     */
    var autoIncrementableId = function(klass) {
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

    Bhdr.toString = function() {
        return 'function Bhdr() { [native code] }'
    }

    return pool.prototype.reset()
}

/**
 * Array extra functions (for Bhdr needs)
 */
(function() {
    /**
     * Remove a value from array (all occurences)
     * @param {*} val: the value to remove
     */
    Array.prototype.remove = function (val) {
        var i = this.indexOf(val)
        return (i > -1) ? this.splice(i, 1) : this
    }

    /**
     * Remove all duplicated values from array
     */
    Array.prototype.distinct = function () {
	    return this.sort().filter(function(item, pos, array) {
	        return !pos || item != array[pos - 1]
	    })
	}

	/**
     * Alias for 'lenght'
     */
	Array.prototype.count = function () {
	    return this.length || 0
	}

	/**
     * Order an array of objects by fields
     * @param {String} field: the field to order by
     * @param {Boolean} order: true to order descending
     * @param {Function} rfunc: function to restrict compairson scope (if needed)
     */
	Array.prototype.orderBy = function (field, order, rfunc) {
	    var key = rfunc ?
           function(x) { return rfunc(x[field]) } :
           function(x) { return x[field] }

        order = (order === 'desc') ? -1 : 1

	    return this.sort(function (a, b) {
	        return a = key(a), b = key(b), order * ((a > b) - (b > a))
        })
	}

	/**
	 * Calculate average of numeric fields
	 * @param {String} field: the field to calculate avg
	 */
	Array.prototype.avg = function (field) {
	    if (this.count() > 0) {
	        var r = []
	        this.forEach(function(k) {
	            r.push(k[field])
	        })

	        return r.reduce(function(a, b) { return a + b }) / this.count()
	    }
	    return 0
	}

	/**
	 * Get last element from list
	 */
	Array.prototype.last = function() {
	    return this[this.count() - 1]
	}

	/**
	 * Get first element from list
	 */
	Array.prototype.first = function() {
	    return this[0]
	}

	/**
	 * First element as an array
	 */
	Array.prototype.head = function() {
        return this.length > 0 ? [this[0]] : null
    }

    /**
     * Last element as an array
     */
    Array.prototype.lst = function() {
        return this.length > 0 ? [this[this.length - 1]] : null
    }

    /**
     * The tail of the list (all but first element)
     */
    Array.prototype.tail = function() {
        var a = this
        if (a.length > 0) this.shift()
        return a
    }

    /**
     * The init of the list (all but last element)
     */
    Array.prototype.init = function() {
        var a = this
        if (a.length > 0) this.pop()
        return a
    }
})()

module.exports = Bhdr