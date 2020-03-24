import DbArray = require('dbarray');
declare class Bhdr {
    private data;
    private static baseId;
    private container;
    constructor(container: Object, options?: Object);
    reset(): this;
    instanceof(klass: Function): Boolean;
    createTable(klass: Function, callback?: Function): Object;
    dropTable(klass: Function, callback?: Function): null;
    insert(klass: Function, obj: Object, callback?: Function): Object;
    update(klass: Function, obj: Object, newObj: Object, callback?: Function): Object;
    delete(klass: Function, obj: Object, callback?: Function): Object;
    find(klass: Function, opt: Object): Object;
    findBy(klass: Function, opt: Object): DbArray<Object>;
    findByI(klass: Function, opt: Object): DbArray<Object>;
    findByLike(klass: Function, opt: Object): DbArray<Object>;
    findByILike(klass: Function, opt: Object): DbArray<Object>;
    findAll(klass: Function): DbArray<Object>;
    findWhere(klass: Function, rfunc: Function): DbArray<Object>;
    map(): void;
    get(klass: Function, id: Number): Object;
    getId(klass: Function, obj: Object): Number;
    export(type: String, ident?: String | Number): any;
    import(db: Object, type: String): Boolean;
    private autoIncrementableId;
    private setupClass;
}
export = Bhdr;
