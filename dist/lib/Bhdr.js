const DbArray = require("dbarray");
class Bhdr {
    constructor(container, options) {
        this.data = new Object();
        this.container = new Object();
        this.autoIncrementableId = (klass) => {
            let cname = klass.prototype.constructor.name;
            if (this.data[cname]) {
                if (this.data[cname].id) {
                    this.data[cname].id = this.data[cname].id + 1;
                }
                else {
                    this.data[cname]['id'] = Bhdr.baseId;
                }
            }
            else {
                this.data[cname] = { id: Bhdr.baseId };
            }
            return this.data[cname].id;
        };
        this.setupClass = (to, from, mainClass) => {
            Object.keys(from).forEach((sk) => {
                let k = sk.toString();
                if ((from[k] instanceof Object) && !(from[k] instanceof Array)) {
                    if (mainClass['__types']) {
                        if (mainClass.__types[k]) {
                            to[k] = new mainClass.__types[k]({});
                            this.setupClass(to[k], from[k], mainClass.__types[k]);
                        }
                        else {
                            to[k] = from[k];
                        }
                    }
                    else {
                        to[k] = from[k];
                    }
                }
                else if (from[k] instanceof Array) {
                    to[k] = new DbArray();
                    from[k].forEach((ff) => {
                        if (mainClass['__types']) {
                            if (mainClass.__types[k]) {
                                if (mainClass.__types[k] instanceof Array) {
                                    if (mainClass.__types[k].length > 0) {
                                        to[k].push(new mainClass.__types[k][0](ff));
                                        this.setupClass(to[k].last(), ff, mainClass.__types[k][0]);
                                    }
                                    else {
                                        to[k] = ff;
                                    }
                                }
                                else {
                                    to[k] = ff;
                                }
                            }
                            else {
                                to[k] = ff;
                            }
                        }
                        else {
                            to[k] = from[k];
                        }
                    });
                }
                else {
                    to[k] = from[k];
                }
            });
        };
        this.container = container || window;
        return this.reset();
    }
    reset() {
        Bhdr.baseId = 1;
        this.data = new Object();
        return this;
    }
    instanceof(klass) {
        return (klass.prototype.constructor.name === 'Bhdr');
    }
    createTable(klass, callback) {
        let cname = klass.prototype.constructor.name;
        if (!this.data[cname]) {
            this.data[cname] = { id: Bhdr.baseId };
            return callback ? callback(this.data[cname]) : this.data[cname];
        }
        return this.data[cname];
    }
    dropTable(klass, callback) {
        let cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            if (callback) {
                callback(this.data[cname]);
            }
            delete this.data[cname];
        }
        return null;
    }
    insert(klass, obj, callback) {
        let cname = klass.prototype.constructor.name;
        if (!this.data[cname]) {
            this.data[cname] = {};
        }
        if (obj instanceof klass) {
            this.data[cname][this.autoIncrementableId(klass)] = obj;
            return callback ? callback(obj) : obj;
        }
        return obj;
    }
    update(klass, obj, newObj, callback) {
        let cname = klass.prototype.constructor.name;
        if (!this.data[cname]) {
            return obj;
        }
        else {
            if (obj instanceof klass) {
                this.data[cname][this.getId(klass, obj)] = newObj;
                return callback ? callback(newObj) : newObj;
            }
            return obj;
        }
    }
    delete(klass, obj, callback) {
        let cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            if (obj instanceof klass) {
                Object.keys(this.data[cname]).forEach((key) => {
                    if (this.data[cname][key] === obj) {
                        delete this.data[cname][key];
                        return callback ? callback(obj) : obj;
                    }
                });
            }
        }
        return obj;
    }
    find(klass, opt) {
        let result = this.findBy(klass, opt) || new DbArray();
        return (result.length > 0) ? result[0] : null;
    }
    findBy(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray();
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                Object.keys(this.data[cname]).forEach((k) => {
                    if (this.data[cname][k][key] &&
                        (this.data[cname][k][key] === opt[key.toString()])) {
                        result.push(this.data[cname][k]);
                    }
                });
            });
        }
        return result;
    }
    findByI(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray();
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                Object.keys(this.data[cname]).forEach((k) => {
                    if (this.data[cname][k][key] &&
                        (this.data[cname][k][key].toString()
                            .toLowerCase() === opt[key.toString()]
                            .toString().toLowerCase())) {
                        result.push(this.data[cname][k]);
                    }
                });
            });
        }
        return result;
    }
    findByLike(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let partial = new DbArray();
        let aux = new DbArray();
        let result = new DbArray();
        Object.keys(this.data[cname]).forEach((k) => {
            if (k !== 'id') {
                partial.push(this.data[cname][k]);
            }
        });
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                partial.forEach((k) => {
                    if (k[key.toString()]) {
                        if (k[key.toString()].toString()
                            .indexOf(opt[key.toString()].toString()) !== -1) {
                            aux.push(k);
                        }
                    }
                });
                partial = aux;
                aux = new DbArray();
            });
            result = partial;
        }
        return result;
    }
    findByILike(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let partial = new DbArray();
        let aux = new DbArray();
        let result = new DbArray();
        Object.keys(this.data[cname]).forEach((k) => {
            if (k !== 'id') {
                partial.push(this.data[cname][k]);
            }
        });
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                partial.forEach((k) => {
                    if (k[key.toString()]) {
                        if (k[key.toString()].toString().toLowerCase()
                            .indexOf(opt[key.toString()].toString().toLowerCase()) !== -1) {
                            aux.push(k);
                        }
                    }
                });
                partial = aux;
                aux = new DbArray();
            });
            result = partial;
        }
        return result;
    }
    findAll(klass) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray();
        if (this.data[cname]) {
            Object.keys(this.data[cname]).forEach((k) => {
                if (k !== 'id') {
                    result.push(this.data[cname][k]);
                }
            });
        }
        return result;
    }
    findWhere(klass, rfunc) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray();
        if (this.data[cname]) {
            Object.keys(this.data[cname]).forEach((k) => {
                if (k !== 'id') {
                    if (rfunc(this.data[cname][k])) {
                        result.push(this.data[cname][k]);
                    }
                }
            });
        }
        return result;
    }
    map() {
        let args = Array.prototype.slice.call(arguments);
        if (args && args.length > 0) {
            args.forEach((klass) => {
                klass.add = (obj, callback) => {
                    return this.insert(klass, obj, callback);
                };
                klass.update = (obj, newObj, callback) => {
                    return this.update(klass, obj, newObj, callback);
                };
                klass.remove = (obj, callback) => {
                    return this.delete(klass, obj, callback);
                };
                klass.find = (opt) => {
                    return this.find(klass, opt);
                };
                klass.findBy = (opt) => {
                    return this.findBy(klass, opt);
                };
                klass.findByI = (opt) => {
                    return this.findByI(klass, opt);
                };
                klass.findByLike = (opt) => {
                    return this.findByLike(klass, opt);
                };
                klass.findByILike = (opt) => {
                    return this.findByILike(klass, opt);
                };
                klass.findAll = () => {
                    return this.findAll(klass);
                };
                klass.findWhere = (rfunc) => {
                    return this.findWhere(klass, rfunc);
                };
                klass.get = (id) => {
                    return this.get(klass, id);
                };
                klass.getId = (obj) => {
                    return this.getId(klass, obj);
                };
                klass.createTable = (callback) => {
                    return this.createTable(klass, callback);
                };
                klass.dropTable = (callback) => {
                    return this.dropTable(klass, callback);
                };
                klass.prototype.save = function (callback) {
                    return klass.add(this, callback);
                };
                klass.prototype.delete = function (callback) {
                    return klass.remove(this, callback);
                };
                klass.prototype.update = function (newObj, callback) {
                    return klass.update(this, newObj, callback);
                };
                klass.prototype.id = function () {
                    return klass.getId(this);
                };
                return klass;
            });
        }
    }
    get(klass, id) {
        let cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            return this.data[cname][id] || null;
        }
        else {
            return null;
        }
    }
    getId(klass, obj) {
        let cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            let res = new DbArray();
            Object.keys(this.data[cname]).forEach((key) => {
                if (this.data[cname][key] === obj)
                    res.push(key);
            });
            return (res.length > 0) ? res[0] : null;
        }
        else {
            return null;
        }
    }
    export(type, ident) {
        let result;
        switch (type) {
            case 'javascript':
                result = this.data;
                break;
            case 'json':
                if (ident) {
                    result = JSON.stringify(this.data, null, ident.valueOf());
                }
                else {
                    result = JSON.stringify(this.data);
                }
                break;
            case 'bwf':
                let main = JSON.stringify(this.data)
                    .trim().split(/"/).join(' ')
                    .split(/{/).join(' { ')
                    .split(/}/).join(' } ')
                    .split(/\[/).join(' \[ ')
                    .split(/\]/).join(' \] ')
                    .split(/ :/).join(': ')
                    .split(/ ,/).join(', ')
                    .split(/  /).join(' ').trim();
                result = 'Bhdr: ' + main;
                break;
        }
        return result;
    }
    import(db, type) {
        let result = false;
        switch (type) {
            case 'javascript':
                this.data = db;
                result = true;
                break;
            case 'json':
                let p = new Object();
                let j = JSON.parse(db.toString());
                Object.keys(j).forEach((sk) => {
                    let k = sk.toString();
                    p[k] = new Object();
                    Object.keys(j[k]).forEach((key) => {
                        if (key === 'id') {
                            p[k][key] = j[k][key.toString()];
                        }
                        else {
                            if (this.container[k]) {
                                p[k][key] = new this.container[k]({});
                            }
                            else {
                                p[k][key] = new Object();
                            }
                            this.setupClass(p[k][key], j[k][key.toString()], this.container[k]);
                        }
                    });
                });
                this.import(p, 'javascript');
                result = true;
                break;
        }
        return result;
    }
}
Bhdr.baseId = 1;
module.exports = Bhdr;
//# sourceMappingURL=Bhdr.js.map