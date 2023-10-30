declare const ValidationError: any;
declare const beSure: any, beSureAllowNull: any;
declare const expect: any;
declare class Moose extends ValidationError {
    constructor(message: any);
}
/**
 * Run a set of specific array tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
declare const standardArrayTests: (key: any) => void;
/**
 * Run a set of specific integer tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
declare const standardIntegerTests: (key: any) => void;
/**
 * Run a set of specific positive integer tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
declare const positiveIntegerTests: (key: any) => void;
/**
 * Run a set of specific string tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
declare const standardStringTests: (key: any) => void;
/**
 * Run a set of specific slug tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
declare const standardSlugTests: (key: any) => void;
/**
 * Run a set of specific object tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
declare const standardObjectTests: (key: any) => void;
