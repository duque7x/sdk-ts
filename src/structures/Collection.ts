export class Collection<K, V> extends Map {
  key: string;

  constructor(data?: Iterable<V>, key?: string) {
    super();
    this.key = key;

    if (data && Array.isArray(data) && key) {
      if (data.length > 0) return;
      for (let v of data) this.set(key, v);
    }
  }
  at(index: number) {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    let i = 0;
    for (let [key, value] of this) {
      if (i === index) {
        return value;
      }
      i++;
    }
  }
  has(key: K) {
    return this.get(key) !== undefined ? true : false;
  }

  get first() {
    return this.values().next().value;
  }
  get last() {
    return [...this.values()].at(-1);
  }
  get length() {
    return this.toArray().length;
  }
  find(predicate: (value: V, key: K, Collection: this) => any) {
    for (const [key, value] of this) {
      if (predicate(value, key, this)) return value;
    }
    return undefined;
  }
  filter(predicate: (value: V, key: K, Collection: this) => any) {
    const results = new Collection([], "");
    for (const [key, value] of this) {
      if (predicate(value, key, this)) results.set(key, value);
    }
    return results;
  }
  some(predicate: (value: V, key: K, Collection: this) => any) {
    const results = new Collection([], "");
    for (const [key, value] of this) {
      if (predicate(value, key, this)) results.set(key, value);
    }
    return results;
  }
  map(callback: (value: V, key: K, Collection: this) => any) {
    return [...this].map(([key, val]) => callback(val, key, this));
  }
  toArray() {
    return [...this.values()];
  }
  toJSON() {
    let obj: Record<string, unknown> = {};
    for (let [k, v] of this.entries()) {
      obj[k] = v;
    }
    return obj;
  }
  sort(compareFunction: (a: V, b: V, Collection: this) => any) {
    const sortedEntries = [...this.entries()].sort((ab, ba) => {
      return compareFunction(ab[1], ba[1], this);
    });

    return new Collection(sortedEntries, this.key);
  }
  toString() {
    return `${this.size}`;
  }
}
module.exports = { Collection };
