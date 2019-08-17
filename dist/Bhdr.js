(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
const DbArray_1 = require("./DbArray");
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
            Object.keys(from).forEach((k) => {
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
                    to[k] = new DbArray_1.DbArray();
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
        let result = this.findBy(klass, opt) || new DbArray_1.DbArray();
        return (result.length > 0) ? result[0] : null;
    }
    findBy(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray_1.DbArray();
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                Object.keys(this.data[cname]).forEach((k) => {
                    if (this.data[cname][k][key] &&
                        (this.data[cname][k][key] === opt[key])) {
                        result.push(this.data[cname][k]);
                    }
                });
            });
        }
        return result;
    }
    findByI(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray_1.DbArray();
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                Object.keys(this.data[cname]).forEach((k) => {
                    if (this.data[cname][k][key] &&
                        (this.data[cname][k][key].toString()
                            .toLowerCase() === opt[key]
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
        let partial = new DbArray_1.DbArray();
        let aux = new DbArray_1.DbArray();
        let result = new DbArray_1.DbArray();
        Object.keys(this.data[cname]).forEach((k) => {
            if (k !== 'id') {
                partial.push(this.data[cname][k]);
            }
        });
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                partial.forEach((k) => {
                    if (k[key]) {
                        if (k[key].toString()
                            .indexOf(opt[key].toString()) !== -1) {
                            aux.push(k);
                        }
                    }
                });
                partial = aux;
                aux = new DbArray_1.DbArray();
            });
            result = partial;
        }
        return result;
    }
    findByILike(klass, opt) {
        let cname = klass.prototype.constructor.name;
        let partial = new DbArray_1.DbArray();
        let aux = new DbArray_1.DbArray();
        let result = new DbArray_1.DbArray();
        Object.keys(this.data[cname]).forEach((k) => {
            if (k !== 'id') {
                partial.push(this.data[cname][k]);
            }
        });
        if (this.data[cname]) {
            Object.keys(opt).forEach((key) => {
                partial.forEach((k) => {
                    if (k[key]) {
                        if (k[key].toString().toLowerCase()
                            .indexOf(opt[key].toString().toLowerCase()) !== -1) {
                            aux.push(k);
                        }
                    }
                });
                partial = aux;
                aux = new DbArray_1.DbArray();
            });
            result = partial;
        }
        return result;
    }
    findAll(klass) {
        let cname = klass.prototype.constructor.name;
        let result = new DbArray_1.DbArray();
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
        let result = new DbArray_1.DbArray();
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
            let res = new DbArray_1.DbArray();
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
                    result = JSON.stringify(this.data, null, ident);
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
                let j = JSON.parse(db);
                Object.keys(j).forEach((k) => {
                    p[k] = new Object();
                    Object.keys(j[k]).forEach((key) => {
                        if (key === 'id') {
                            p[k][key] = j[k][key];
                        }
                        else {
                            if (this.container[k]) {
                                p[k][key] = new this.container[k]({});
                            }
                            else {
                                p[k][key] = new Object();
                            }
                            this.setupClass(p[k][key], j[k][key], this.container[k]);
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
exports.Bhdr = Bhdr;

},{"./DbArray":2}],2:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
class DbArray extends Array {
    remove(val) {
        let a = new DbArray();
        let aux = this.filter((e) => { e !== val; });
        aux.forEach((val) => {
            a.push(val);
        });
        return a;
    }
    distinct() {
        let a = new DbArray();
        let aux = this.sort().filter((item, pos, array) => {
            return !pos || item != array[pos - 1];
        });
        aux.forEach((val) => {
            a.push(val);
        });
        return a;
    }
    count() {
        return this.length || 0;
    }
    orderBy(field, order, rfunc) {
        let key = rfunc ?
            (x) => { return rfunc(x[field]); } :
            (x) => { return x[field]; };
        order = (order === 'desc') ? -1 : 1;
        return this.sort((a, b) => {
            let x = key(a);
            let y = key(b);
            let xy = x > y;
            let yx = y > x;
            return order * (xy - yx);
        });
    }
    avg(field) {
        if (this.count() > 0) {
            let r = [];
            this.forEach((k) => {
                r.push(k[field]);
            });
            return r.reduce((a, b) => { return a + b; }) / this.count();
        }
        return 0;
    }
    last() {
        return this[this.count() - 1];
    }
    first() {
        return this[0];
    }
    head() {
        let a = new DbArray();
        if (this.length > 0) {
            a.push(this[0]);
        }
        return a;
    }
    lst() {
        let a = new DbArray();
        if (this.length > 0) {
            a.push(this[this.length - 1]);
        }
        return a;
    }
    tail() {
        let a = this;
        if (a.length > 0)
            this.shift();
        return a;
    }
    init() {
        let a = this;
        if (a.length > 0)
            this.pop();
        return a;
    }
}
exports.DbArray = DbArray;

},{}]},{},[2,1]);
