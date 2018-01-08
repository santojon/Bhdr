/********************************************
 * Base mock class
 * Used to extend more classes
 * Accept any params
 ********************************************/
class BaseClass {
    constructor(obj) {
        Object.keys(obj).forEach((key) => {
            this[key] = obj[key]
        })
    }
}

module.exports = BaseClass;