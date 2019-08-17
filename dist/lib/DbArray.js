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
//# sourceMappingURL=DbArray.js.map