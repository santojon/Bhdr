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
//# sourceMappingURL=DbArray.js.map