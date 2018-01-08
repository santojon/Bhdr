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
//# sourceMappingURL=Bhdr.js.map