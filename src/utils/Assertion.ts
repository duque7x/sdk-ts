/**
 * Class used to assert types in the sdk
 */
export class Assertion {
  constructor() {}

  /**
   * Tests if given key is a string
   * @param key Key to test
   */
  static assertString(key: unknown) {    
    if (typeof key !== "string") throw new Error(`${key} must be a string`);
    if (!key || key === "") throw new Error(`${key} must be a string`);
    return true;
  }

  /**
   * Tests if given key is a number
   * @param key Key to test
   */
  static assertNumber(key: unknown) {
    if (typeof key !== "number") throw new Error(`${key} must be a number`);
    return true;
  }

  /**
   * Tests if given key is a boolean
   * @param key Key to test
   */
  static assertBoolean(key: unknown) {
    if (typeof key !== "boolean") throw new Error(`${key} must be a boolean`);
    return true;
  }

  /**
   * Tests if given key is an array
   * @param key Key to test
   */
  static assertArray(key: unknown) {
    if (!Array.isArray(key)) throw new Error(`${key} must be an array`);
    return true;
  }

  /**
   * Tests if given key is an object
   * @param key Key to test
   */
  static assertObject(key: unknown) {
    if (typeof key === "object") throw new Error(`${key} must be an object`);
    return true;
  }

  toString() {
    return 'string, number, boolean, array, object';
  }
}
