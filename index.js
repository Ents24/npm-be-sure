const ValidationError = require('./src/validation-error.js');
const { getValidator, setValidator } = require('./src/validators.js');

/**
 * Find a validator that matches `key`, run it with the passed `value`, throw on failure
 * @param {Mixed} value the value to check
 * @param {String} key the validator key to check against
 * @param {Type | undefined} errorType a type that extends Error
 * @param {String | undefined} errorText the text to include if an error is thrown
 * @throws A validator matching the passed key must exist and return true
 */
module.exports.beSure = (value, key, errorType, errorText) => {
  const validator = getValidator(key)

  if(typeof validator !== 'function') {
    throw `No validator found for key: ${key}`
  }

  const ok = validator(value)

  if (ok === true) {
    return
  }

  // Apply default error text if necessary
  if (typeof errorText !== 'string') {
    errorText = `${decorateValue(value)} failed validation for: ${key}`
  }

  // Apply default error type if necessary (JS classes are constructor functions)
  if (typeof errorType !== 'function' || errorType.prototype instanceof Error === false) {
    errorType = ValidationError
  }

  throw new errorType(errorText)
}

/**
 * Find a validator that matches `key`, run it with the passed `value`, throw on failure
 * Never throw on `null` value
 * @param {Mixed} value the value to check
 * @param {String} key the validator key to check against
 * @param {Type | undefined} errorType a type that extends Error
 * @param {String | undefined} errorText the text to include if an error is thrown
 * @throws A validator matching the passed key must exist and return true
 */
module.exports.beSureAllowNull = (value, key, errorType, errorText) => {
  if (value !== null) {
    this.beSure(value, key, errorType, errorText)
  }
}

/**
 * Decorate a value to make log output more readable. Currently just wraps
 * strings in quotes
 */
decorateValue = value => typeof value === 'string' ?  `'${value}'` : value;

module.exports.setValidator = setValidator