/**
 * Class that represents a an extended array
 * with utils for database uses in Bhdr
 */
export class DbArray<T> extends Array<T> {
    /**
     * Remove a value from array (all occurences)
     * @param val: the value to remove
     */
    remove(val: T): DbArray<T> {
        let a = new DbArray<T>()
        let aux = this.filter((e: T) => { e !== val })
        
        aux.forEach((val: T) => {
            a.push(val)
        })
        return a
    }

    /**
     * Remove all duplicated values from array
     */
    distinct(): DbArray<T> {
        let a = new DbArray<T>()
        let aux = this.sort().filter((item: any, pos: number, array: any): any => {
            return !pos || item != array[pos - 1]
        })

        aux.forEach((val: T) => {
            a.push(val)
        })
        return a
    }

    /**
     * Alias for 'lenght'
     */
    count(): number {
        return this.length || 0
    }

    /**
     * Order an array of objects by fields
     * @param {string} field: the field to order by
     * @param {string} order: 'desc' to order descending
     * @param {Function} rfunc: function to restrict compairson scope (if needed)
     */
    orderBy(field: string, order: any, rfunc: Function): DbArray<T> {
        let key = rfunc ?
            (x: any): object => { return rfunc(x[field]) } :
            (x: any): object => { return x[field] }

        order = (order === 'desc') ? -1 : 1

        return this.sort((a: T, b: T): number => {
            let x: any = key(a)
            let y: any = key(b)
            let xy: any = x > y
            let yx: any = y > x

            return order * (xy - yx)
        })
    }

    /**
     * Calculate average of numeric fields
     * @param {string} field: the field to calculate avg
     */
    avg(field: string): number {
        if (this.count() > 0) {
            let r: any = []
            this.forEach((k: any) => {
                r.push(k[field])
            })
            return r.reduce((a: any, b: any): any => { return a + b }) / this.count()
        }
        return 0
    }

    /**
     * Get last element from list
     */
    last(): T {
        return this[this.count() - 1]
    }

    /**
     * Get first element from list
     */
    first(): T {
        return this[0]
    }

    /**
     * First element as an array
     */
    head(): DbArray<T> {
        let a = new DbArray<T>()
        if (this.length > 0) {
            a.push(this[0])
        }
        return a
    }

    /**
     * Last element as an array
     */
    lst(): DbArray<T> {
        let a = new DbArray<T>()
        if (this.length > 0) {
            a.push(this[this.length - 1])
        }
        return a
    }

    /**
     * The tail of the list (all but first element)
     */
    tail(): DbArray<T> {
        let a = this
        if (a.length > 0) this.shift()
        return a
    }

    /**
     * The init of the list (all but last element)
     */
    init(): DbArray<T> {
        let a = this
        if (a.length > 0) this.pop()
        return a
    }
}