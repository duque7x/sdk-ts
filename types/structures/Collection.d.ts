export declare class Collection<K, V> extends Map<K, V> {
    key: string;
    constructor(key?: string, data?: Iterable<V>);
    at(index: number): V;
    has(key: K): boolean;
    get first(): V;
    get last(): V;
    get length(): number;
    find(predicate: (value: V, key: K, Collection: this) => any): V;
    filter(predicate: (value: V, key: K, Collection: this) => any): Collection<K, V>;
    some(predicate: (value: V, key: K, Collection: this) => any): Collection<unknown, any>;
    map(callback: (value: V, key: K, Collection: this) => any): any[];
    toArray(): V[];
    toJSON(): Record<string, unknown>;
    sort(compareFunction: (a: V, b: V, Collection: this) => any): Collection<unknown, [K, V]>;
    toString(): string;
}
