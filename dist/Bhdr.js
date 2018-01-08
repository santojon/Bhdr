(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", { value: true });
var DbArray_1 = require("./DbArray");
var Bhdr = (function () {
    function Bhdr(container, options) {
        var _this = this;
        this.data = new Object();
        this.container = new Object();
        this.autoIncrementableId = function (klass) {
            var cname = klass.prototype.constructor.name;
            if (_this.data[cname]) {
                if (_this.data[cname].id) {
                    _this.data[cname].id = _this.data[cname].id + 1;
                }
                else {
                    _this.data[cname]['id'] = Bhdr.baseId;
                }
            }
            else {
                _this.data[cname] = { id: Bhdr.baseId };
            }
            return _this.data[cname].id;
        };
        this.setupClass = function (to, from, mainClass) {
            Object.keys(from).forEach(function (k) {
                if ((from[k] instanceof Object) && !(from[k] instanceof Array)) {
                    if (mainClass['__types']) {
                        if (mainClass.__types[k]) {
                            to[k] = new mainClass.__types[k]({});
                            _this.setupClass(to[k], from[k], mainClass.__types[k]);
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
                    from[k].forEach(function (ff) {
                        if (mainClass['__types']) {
                            if (mainClass.__types[k]) {
                                if (mainClass.__types[k] instanceof Array) {
                                    if (mainClass.__types[k].length > 0) {
                                        to[k].push(new mainClass.__types[k][0](ff));
                                        _this.setupClass(to[k].last(), ff, mainClass.__types[k][0]);
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
    Bhdr.prototype.reset = function () {
        Bhdr.baseId = 1;
        this.data = new Object();
        return this;
    };
    Bhdr.prototype.instanceof = function (klass) {
        return (klass.prototype.constructor.name === 'Bhdr');
    };
    Bhdr.prototype.createTable = function (klass, callback) {
        var cname = klass.prototype.constructor.name;
        if (!this.data[cname]) {
            this.data[cname] = { id: Bhdr.baseId };
            return callback ? callback(this.data[cname]) : this.data[cname];
        }
        return this.data[cname];
    };
    Bhdr.prototype.dropTable = function (klass, callback) {
        var cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            if (callback) {
                callback(this.data[cname]);
            }
            delete this.data[cname];
        }
        return null;
    };
    Bhdr.prototype.insert = function (klass, obj, callback) {
        var cname = klass.prototype.constructor.name;
        if (!this.data[cname]) {
            this.data[cname] = {};
        }
        if (obj instanceof klass) {
            this.data[cname][this.autoIncrementableId(klass)] = obj;
            return callback ? callback(obj) : obj;
        }
        return obj;
    };
    Bhdr.prototype.update = function (klass, obj, newObj, callback) {
        var cname = klass.prototype.constructor.name;
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
    };
    Bhdr.prototype.delete = function (klass, obj, callback) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            if (obj instanceof klass) {
                Object.keys(this.data[cname]).forEach(function (key) {
                    if (_this.data[cname][key] === obj) {
                        delete _this.data[cname][key];
                        return callback ? callback(obj) : obj;
                    }
                });
            }
        }
        return obj;
    };
    Bhdr.prototype.find = function (klass, opt) {
        var result = this.findBy(klass, opt) || new DbArray_1.DbArray();
        return (result.length > 0) ? result[0] : null;
    };
    Bhdr.prototype.findBy = function (klass, opt) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        var result = new DbArray_1.DbArray();
        if (this.data[cname]) {
            Object.keys(opt).forEach(function (key) {
                Object.keys(_this.data[cname]).forEach(function (k) {
                    if (_this.data[cname][k][key] &&
                        (_this.data[cname][k][key] === opt[key])) {
                        result.push(_this.data[cname][k]);
                    }
                });
            });
        }
        return result;
    };
    Bhdr.prototype.findByI = function (klass, opt) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        var result = new DbArray_1.DbArray();
        if (this.data[cname]) {
            Object.keys(opt).forEach(function (key) {
                Object.keys(_this.data[cname]).forEach(function (k) {
                    if (_this.data[cname][k][key] &&
                        (_this.data[cname][k][key].toString()
                            .toLowerCase() === opt[key]
                            .toString().toLowerCase())) {
                        result.push(_this.data[cname][k]);
                    }
                });
            });
        }
        return result;
    };
    Bhdr.prototype.findByLike = function (klass, opt) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        var partial = new DbArray_1.DbArray();
        var aux = new DbArray_1.DbArray();
        var result = new DbArray_1.DbArray();
        Object.keys(this.data[cname]).forEach(function (k) {
            if (k !== 'id') {
                partial.push(_this.data[cname][k]);
            }
        });
        if (this.data[cname]) {
            Object.keys(opt).forEach(function (key) {
                partial.forEach(function (k) {
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
    };
    Bhdr.prototype.findByILike = function (klass, opt) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        var partial = new DbArray_1.DbArray();
        var aux = new DbArray_1.DbArray();
        var result = new DbArray_1.DbArray();
        Object.keys(this.data[cname]).forEach(function (k) {
            if (k !== 'id') {
                partial.push(_this.data[cname][k]);
            }
        });
        if (this.data[cname]) {
            Object.keys(opt).forEach(function (key) {
                partial.forEach(function (k) {
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
    };
    Bhdr.prototype.findAll = function (klass) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        var result = new DbArray_1.DbArray();
        if (this.data[cname]) {
            Object.keys(this.data[cname]).forEach(function (k) {
                if (k !== 'id') {
                    result.push(_this.data[cname][k]);
                }
            });
        }
        return result;
    };
    Bhdr.prototype.findWhere = function (klass, rfunc) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        var result = new DbArray_1.DbArray();
        if (this.data[cname]) {
            Object.keys(this.data[cname]).forEach(function (k) {
                if (k !== 'id') {
                    if (rfunc(_this.data[cname][k])) {
                        result.push(_this.data[cname][k]);
                    }
                }
            });
        }
        return result;
    };
    Bhdr.prototype.map = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        if (args && args.length > 0) {
            args.forEach(function (klass) {
                klass.add = function (obj, callback) {
                    return _this.insert(klass, obj, callback);
                };
                klass.update = function (obj, newObj, callback) {
                    return _this.update(klass, obj, newObj, callback);
                };
                klass.remove = function (obj, callback) {
                    return _this.delete(klass, obj, callback);
                };
                klass.find = function (opt) {
                    return _this.find(klass, opt);
                };
                klass.findBy = function (opt) {
                    return _this.findBy(klass, opt);
                };
                klass.findByI = function (opt) {
                    return _this.findByI(klass, opt);
                };
                klass.findByLike = function (opt) {
                    return _this.findByLike(klass, opt);
                };
                klass.findByILike = function (opt) {
                    return _this.findByILike(klass, opt);
                };
                klass.findAll = function () {
                    return _this.findAll(klass);
                };
                klass.findWhere = function (rfunc) {
                    return _this.findWhere(klass, rfunc);
                };
                klass.get = function (id) {
                    return _this.get(klass, id);
                };
                klass.getId = function (obj) {
                    return _this.getId(klass, obj);
                };
                klass.createTable = function (callback) {
                    return _this.createTable(klass, callback);
                };
                klass.dropTable = function (callback) {
                    return _this.dropTable(klass, callback);
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
    };
    Bhdr.prototype.get = function (klass, id) {
        var cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            return this.data[cname][id] || null;
        }
        else {
            return null;
        }
    };
    Bhdr.prototype.getId = function (klass, obj) {
        var _this = this;
        var cname = klass.prototype.constructor.name;
        if (this.data[cname]) {
            var res_1 = new DbArray_1.DbArray();
            Object.keys(this.data[cname]).forEach(function (key) {
                if (_this.data[cname][key] === obj)
                    res_1.push(key);
            });
            return (res_1.length > 0) ? res_1[0] : null;
        }
        else {
            return null;
        }
    };
    Bhdr.prototype.export = function (type, ident) {
        var result;
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
                var main = JSON.stringify(this.data)
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
    };
    Bhdr.prototype.import = function (db, type) {
        var _this = this;
        var result = false;
        switch (type) {
            case 'javascript':
                this.data = db;
                result = true;
                break;
            case 'json':
                var p_1 = new Object();
                var j_1 = JSON.parse(db);
                Object.keys(j_1).forEach(function (k) {
                    p_1[k] = new Object();
                    Object.keys(j_1[k]).forEach(function (key) {
                        if (key === 'id') {
                            p_1[k][key] = j_1[k][key];
                        }
                        else {
                            if (_this.container[k]) {
                                p_1[k][key] = new _this.container[k]({});
                            }
                            else {
                                p_1[k][key] = new Object();
                            }
                            _this.setupClass(p_1[k][key], j_1[k][key], _this.container[k]);
                        }
                    });
                });
                this.import(p_1, 'javascript');
                result = true;
                break;
        }
        return result;
    };
    Bhdr.baseId = 1;
    return Bhdr;
}());
exports.Bhdr = Bhdr;

},{"./DbArray":2}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DbArray = (function (_super) {
    __extends(DbArray, _super);
    function DbArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DbArray.prototype.remove = function (val) {
        var a = new DbArray();
        var aux = this.filter(function (e) { e !== val; });
        aux.forEach(function (val) {
            a.push(val);
        });
        return a;
    };
    DbArray.prototype.distinct = function () {
        var a = new DbArray();
        var aux = this.sort().filter(function (item, pos, array) {
            return !pos || item != array[pos - 1];
        });
        aux.forEach(function (val) {
            a.push(val);
        });
        return a;
    };
    DbArray.prototype.count = function () {
        return this.length || 0;
    };
    DbArray.prototype.orderBy = function (field, order, rfunc) {
        var key = rfunc ?
            function (x) { return rfunc(x[field]); } :
            function (x) { return x[field]; };
        order = (order === 'desc') ? -1 : 1;
        return this.sort(function (a, b) {
            var x = key(a);
            var y = key(b);
            var xy = x > y;
            var yx = y > x;
            return order * (xy - yx);
        });
    };
    DbArray.prototype.avg = function (field) {
        if (this.count() > 0) {
            var r_1 = [];
            this.forEach(function (k) {
                r_1.push(k[field]);
            });
            return r_1.reduce(function (a, b) { return a + b; }) / this.count();
        }
        return 0;
    };
    DbArray.prototype.last = function () {
        return this[this.count() - 1];
    };
    DbArray.prototype.first = function () {
        return this[0];
    };
    DbArray.prototype.head = function () {
        var a = new DbArray();
        if (this.length > 0) {
            a.push(this[0]);
        }
        return a;
    };
    DbArray.prototype.lst = function () {
        var a = new DbArray();
        if (this.length > 0) {
            a.push(this[this.length - 1]);
        }
        return a;
    };
    DbArray.prototype.tail = function () {
        var a = this;
        if (a.length > 0)
            this.shift();
        return a;
    };
    DbArray.prototype.init = function () {
        var a = this;
        if (a.length > 0)
            this.pop();
        return a;
    };
    return DbArray;
}(Array));
exports.DbArray = DbArray;

},{}]},{},[2,1])();
