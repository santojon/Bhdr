// Get DbArray (Array with extras for Bhdr purposes)
import { DbArray } from './DbArray'

/**
 * Class that represents a data pool
 * Made to simulate an in-memory database
 */
export class Bhdr {

    // needed variables
    private data: any = new Object()
    private static baseId: number = 1
    private container: any = new Object()

    /**
     * Class constructor
     * @param {object} container: Container to create Bhdr object (Optional if in window)
     * @param {object} options: Database options (Optional) [TODO]
     */
    constructor(container: object, options?: object) {
        this.container = container || window
        return this.reset()
    }

    /**
     * Function responsible to reinitialize the pool
     */
    reset() {
        Bhdr.baseId = 1
        this.data = new Object()
        return this
    }
        
    /**
     * Function to validate instance of Bhdr
     * @param {Function} klass: A Class to verify if is Bhdr
     */
    instanceof(klass: Function): Boolean {
        return (klass.prototype.constructor.name === 'Bhdr')
    }

    /**
     * Create a table if it not exists
     * @param {Function} klass: the class of the objects of the table
     * @param {Function} callback?: an optional callback function to run after creation
     */
    createTable(klass: Function, callback?: Function): object {
        let cname = klass.prototype.constructor.name
        if (!this.data[cname]) {
            this.data[cname] = { id: Bhdr.baseId }
            return callback ? callback(this.data[cname]) : this.data[cname]
        }
        return this.data[cname]
    }

    /**
     * Drop a table if it not exists
     * @param {Function} klass: the class of the objects of the table
     * @param {Function} callback?: an optional callback function to run before drop
     */
    dropTable(klass: Function, callback?: Function): null {
        let cname = klass.prototype.constructor.name
        if (this.data[cname]) {
            if (callback) {
                callback(this.data[cname])
            }
            delete this.data[cname]
        }
        return null
    }

    /**
     * Function used to add new instances into 'database'
     * @param {Function} klass: the class of the object to add
     * @param {object} obj: the object to add into 'database'
     * @param {Function} callback?: an optional callback function to run after insert
     */
    insert(klass: Function, obj: object, callback?: Function): object {
        let cname = klass.prototype.constructor.name
        if (!this.data[cname]) {
            this.data[cname] = {}
        }

        if (obj instanceof klass) {
            this.data[cname][this.autoIncrementableId(klass)] = obj
            return callback ? callback(obj) : obj
        }
        return obj
    }

    /**
     * Function used to update instances in 'database'
     * @param {Function} klass: the class of the object to add
     * @param {object} obj: the object to update in 'database'
     * @param {object} newObj: the new Object
     * @param {Function} callback?: an optional callback function to run after insert
     */
    update(klass: Function, obj: object, newObj: object, callback?: Function): object {
        let cname = klass.prototype.constructor.name
        if (!this.data[cname]) {
            return obj
        } else {
            if (obj instanceof klass) {
                this.data[cname][this.getId(klass, obj)] = newObj
                return callback ? callback(newObj) : newObj
            }
            return obj
        }
    }

    /**
     * Function used to remove instances from 'database'
     * @param {Function} klass: the class of the object to remove
     * @param {object} obj: the object to remove from 'database'
     * @param {Function} callback?: an optional callback function to run after delete
     */
    delete(klass: Function, obj: object, callback?: Function): object {
        let cname = klass.prototype.constructor.name

        if (this.data[cname]) {
            if (obj instanceof klass) {
                Object.keys(this.data[cname]).forEach(
                    (key: any) => {
                        if (this.data[cname][key] === obj) {
                            delete this.data[cname][key]
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
     * @param {object} opt: the options used to find
     */
    find(klass: Function, opt: object): object {
        let result = this.findBy(klass, opt) || new DbArray()
        return (result.length > 0) ? result[0] : null
    }

    /**
     * Function used to find instances in 'database' with exact values
     * @param {Function} klass: the class of the object to find
     * @param {object} opt: the options used to find
     */
    findBy(klass: Function, opt: any): DbArray<any> {
        let cname = klass.prototype.constructor.name
        let result = new DbArray()

        if (this.data[cname]) {
            Object.keys(opt).forEach(
                (key: string | number) => {
                    Object.keys(this.data[cname]).forEach(
                        (k: string) => {
                            if (this.data[cname][k][key] &&
                                    (this.data[cname][k][key] === opt[key])) {
                                result.push(this.data[cname][k])
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
     * @param {object} opt: the options used to find
     */
    findByI(klass: Function, opt: any): DbArray<any> {
        let cname = klass.prototype.constructor.name
        let result = new DbArray()

        if (this.data[cname]) {
            Object.keys(opt).forEach(
                (key: string | number) => {
                    Object.keys(this.data[cname]).forEach(
                        (k: string) => {
                            if (this.data[cname][k][key] &&
                                    (this.data[cname][k][key].toString()
                                            .toLowerCase() === opt[key]
                                                .toString().toLowerCase())) {
                                result.push(this.data[cname][k])
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
     * @param {object} opt: the options used to find
     */
    findByLike(klass: Function, opt: any): DbArray<any> {
        let cname = klass.prototype.constructor.name
        let partial = new DbArray()
        let aux = new DbArray()

        let result = new DbArray()

        Object.keys(this.data[cname]).forEach(
            (k: string | number) => {
                if (k !== 'id') {
                    partial.push(this.data[cname][k])
                }
            }
        )

        if (this.data[cname]) {
            Object.keys(opt).forEach(
                (key: string) => {
                    partial.forEach(
                        (k: any) => {
                            if (k[key]) {
                                if (k[key].toString()
                                        .indexOf(opt[key].toString()) !== -1) {

                                    aux.push(k)
                                }
                            }
                        }
                    )
                    partial = aux
                    aux = new DbArray()
                }
            )
            result = partial
        }
        return result
    }

    /**
     * Function used to find instances in 'database' with similar values (case insensitive)
     * @param {Function} klass: the class of the object to find
     * @param {object} opt: the options used to find
     */
    findByILike(klass: Function, opt: any): DbArray<any> {
        let cname = klass.prototype.constructor.name
        let partial = new DbArray()
        let aux = new DbArray()

        let result = new DbArray()

        Object.keys(this.data[cname]).forEach(
            (k: string | number) => {
                if (k !== 'id') {
                    partial.push(this.data[cname][k])
                }
            }
        )

        if (this.data[cname]) {
            Object.keys(opt).forEach(
                (key: string) => {
                    partial.forEach(
                        (k: any) => {
                            if (k[key]) {
                                if (k[key].toString().toLowerCase()
                                        .indexOf(opt[key].toString().toLowerCase()) !== -1) {

                                    aux.push(k)
                                }
                            }
                        }
                    )
                    partial = aux
                    aux = new DbArray()
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
    findAll(klass: Function): DbArray<any> {
        let cname = klass.prototype.constructor.name
        let result = new DbArray()

        if (this.data[cname]) {
            Object.keys(this.data[cname]).forEach(
                (k: string | number) => {
                    if (k !== 'id') {
                        result.push(this.data[cname][k])
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
    findWhere(klass: Function, rfunc: Function): DbArray<any> {
        let cname = klass.prototype.constructor.name
        let result = new DbArray()

        if (this.data[cname]) {
            Object.keys(this.data[cname]).forEach(
                (k: string | number) => {
                    if (k !== 'id') {
                        if (rfunc(this.data[cname][k])) {
                            result.push(this.data[cname][k])
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
    map(): any {
        let args = Array.prototype.slice.call(arguments)
        if (args && args.length > 0) {
            args.forEach((klass: any) => {
                /******************************************
                 * Append methods on Class (Static methods)
                 ******************************************/

                klass.add = (obj: object, callback?: Function): object => {
                    return this.insert(klass, obj, callback)
                }

                klass.update = (obj: object, newObj: object, callback?: Function): object => {
                    return this.update(klass, obj, newObj, callback)
                }

                klass.remove = (obj: object, callback?: Function): object => {
                    return this.delete(klass, obj, callback)
                }

                klass.find = (opt: object): object => {
                    return this.find(klass, opt)
                }

                klass.findBy = (opt: object): DbArray<any> => {
                    return this.findBy(klass, opt)
                }

                klass.findByI = (opt: object): DbArray<any> => {
                    return this.findByI(klass, opt)
                }

                klass.findByLike = (opt: object): DbArray<any> => {
                    return this.findByLike(klass, opt)
                }

                klass.findByILike = (opt: object): DbArray<any> => {
                    return this.findByILike(klass, opt)
                }

                klass.findAll = (): DbArray<any> => {
                    return this.findAll(klass)
                }

                klass.findWhere = (rfunc: Function): DbArray<any> => {
                    return this.findWhere(klass, rfunc)
                }

                klass.get = (id: number): object | null => {
                    return this.get(klass, id)
                }

                klass.getId = (obj: object): number => {
                    return this.getId(klass, obj)
                }

                klass.createTable = (callback?: Function): object => {
                    return this.createTable(klass, callback)
                }

                klass.dropTable = (callback?: Function): null => {
                    return this.dropTable(klass, callback)
                }

                /******************************************
                 * Append methods on prototype (instances)
                 * 
                 * The use of 'function' instead of arrows
                 * IS NEEDED TO PRESERVE THE BIND OF 'this'
                 * STAMENT!!! DO NOT CHANGE THAT!!!!!!!!!!!
                 ******************************************/

                klass.prototype.save = function(callback?: Function): object {
                    return klass.add(this, callback)
                }

                klass.prototype.delete = function(callback?: Function): object {
                    return klass.remove(this, callback)
                }

                klass.prototype.update = function(newObj: object, callback?: Function): object {
                    return klass.update(this, newObj, callback)
                }

                klass.prototype.id = function(): number {
                    return klass.getId(this)
                }
                return klass
            })
        }
    }

    /**
     * Function used get the 'entity' with the given class and id
     * @param {Function} klass: the class of the object to get
     * @param {number} id: the id of the object in Bhdr
     */
    get(klass: Function, id: number): object | null {
        let cname = klass.prototype.constructor.name

        if (this.data[cname]) {
            return this.data[cname][id] || null
        } else {
            return null
        }
    }

    /**
     * Get the id of element in database
     * @param {Function} klass: the related class
     * @param {object} obj: the object to get the id of
     */
    getId(klass: Function, obj: object): any {
        let cname = klass.prototype.constructor.name

        if (this.data[cname]) {
            let res = new DbArray()

            Object.keys(this.data[cname]).forEach((key: string | number) => {
                if (this.data[cname][key] === obj) res.push(key)
            })

            return (res.length > 0) ? res[0] : null
        } else {
            return null
        }
    }

    /**
     * Function used to export 'database' to given type
     * @param {string} type: the type to export, as string
     * @param {number} ident: [Optional] (JSON ONLY!) the identation spaces, as number
     */
    export(type: string, ident?: string | number): any {
        let result
        switch (type) {
            case 'javascript':
                result = this.data
                break
            case 'json':
                if (ident) {
                    result = JSON.stringify(this.data, null, ident)
                } else {
                    result = JSON.stringify(this.data)
                }
                break
            case 'bwf':
                let main = JSON.stringify(this.data)
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
     * @param {string} type: the type to import, as string
     * @param {object} db: the 'database' to import
     */
    import(db: string, type: String): Boolean {
        let result = false
        switch (type) {
            case 'javascript':
                this.data = db
                result = true
                break
            case 'json':
                let p: any = new Object()
                let j = JSON.parse(db)

                // For each 'table'
                Object.keys(j).forEach((k: string) => {
                    p[k] = new Object()

                    // For each object in 'table'
                    Object.keys(j[k]).forEach((key: string) => {
                        if (key === 'id') {
                            p[k][key] = j[k][key]
                        } else {
                            // create an object
                            if (this.container[k]) {
                                p[k][key] = new this.container[k]({})
                            } else {
                                p[k][key] = new Object()
                            }
                            this.setupClass(p[k][key], j[k][key], this.container[k])
                        }
                    })
                })

                this.import(p, 'javascript')
                result = true
                break
        }
        return result
    }

    /**
     * Increments the id of a 'table'
     * @param {Function} klass: A Class to get name of the 'table'
     */
    private autoIncrementableId = (klass: Function): number => {
        let cname = klass.prototype.constructor.name
        if (this.data[cname]) {
            if (this.data[cname].id) {
                this.data[cname].id = this.data[cname].id + 1
            } else {
                this.data[cname]['id'] = Bhdr.baseId
            }
        } else {
            this.data[cname] = { id: Bhdr.baseId }
        }
        return this.data[cname].id
    }

    /**
     * Setup class from a base object to a real class (Function)
     * Using mainClass as example (base)
     * @param {object} to 
     * @param {object} from 
     * @param {object} mainClass 
     */
    private setupClass = (to: any, from: any, mainClass: any) => {
        Object.keys(from).forEach((k: any) => {
            // sub-objects
            if ((from[k] instanceof Object) && !(from[k] instanceof Array)) {
                // Bwf made classes have this property (or you can inject)
                // the types for each property in top-level class
                if (mainClass['__types']) {
                    // the current key has a defined type
                    if (mainClass.__types[k]) {
                        to[k] = new mainClass.__types[k]({})

                        // go deeper in sub-objects
                        this.setupClass(to[k], from[k], mainClass.__types[k])
                    } else {        // type not defined
                        to[k] = from[k]
                    }
                } else {        // no '__types' property
                    to[k] = from[k]
                }
            } else if (from[k] instanceof Array) {
                to[k] = new DbArray()
                // TODO: import typed arrays
                from[k].forEach((ff: any) => {
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
                                    this.setupClass(to[k].last(), ff, mainClass.__types[k][0])
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
}