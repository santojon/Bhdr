import { DbArray } from './DbArray';
export declare class Bhdr {
    private data;
    private static baseId;
    private container;
    constructor(container: object, options?: object);
    reset(): this;
    instanceof(klass: Function): Boolean;
    createTable(klass: Function, callback?: Function): object;
    dropTable(klass: Function, callback?: Function): null;
    insert(klass: Function, obj: object, callback?: Function): object;
    update(klass: Function, obj: object, newObj: object, callback?: Function): object;
    delete(klass: Function, obj: object, callback?: Function): object;
    find(klass: Function, opt: object): object;
    findBy(klass: Function, opt: any): DbArray<any>;
    findByI(klass: Function, opt: any): DbArray<any>;
    findByLike(klass: Function, opt: any): DbArray<any>;
    findByILike(klass: Function, opt: any): DbArray<any>;
    findAll(klass: Function): DbArray<any>;
    findWhere(klass: Function, rfunc: Function): DbArray<any>;
    map(): any;
    get(klass: Function, id: number): object | null;
    getId(klass: Function, obj: object): any;
    export(type: string, ident?: string | number): any;
    import(db: string, type: String): Boolean;
    private autoIncrementableId;
    private setupClass;
}
