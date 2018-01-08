export declare class DbArray<T> extends Array<T> {
    remove(val: T): DbArray<T>;
    distinct(): DbArray<T>;
    count(): number;
    orderBy(field: string, order: any, rfunc: Function): DbArray<T>;
    avg(field: string): number;
    last(): T;
    first(): T;
    head(): DbArray<T>;
    lst(): DbArray<T>;
    tail(): DbArray<T>;
    init(): DbArray<T>;
}
