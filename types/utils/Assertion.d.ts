/**
 * Class used to assert types in the sdk
 */
export declare class Assertion {
    constructor();
    /**
     * Tests if given key is a string
     * @param key Key to test
     */
    static assertString(key: unknown): key is string;
    /**
     * Tests if given key is a number
     * @param key Key to test
     */
    static assertNumber(key: unknown): key is number;
    /**
     * Tests if given key is a boolean
     * @param key Key to test
     */
    static assertBoolean(key: unknown): key is boolean;
    /**
     * Tests if given key is an array
     * @param key Key to test
     */
    static assertArray(key: unknown): key is object;
    /**
     * Tests if given key is an object
     * @param key Key to test
     */
    static assertObject(key: unknown): key is object;
    toString(): string;
}
