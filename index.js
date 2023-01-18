const ValidationError = require('./src/validation-error.js');
const { getValidator, setValidator } = require('./src/validators.js');

/**
 * Find a validator that matches `key`, run it with the passed `value`, throw on failure
 * @param {Mixed} value the value to check
 * @param {String} key the validator key to check against
 * @throws A validator matching the passed key must exist and return true
 */
module.exports.beSure = (value, key) => {
  const validator = getValidator(key)

  if(typeof validator !== 'function') {
    throw `No validator found for key: ${key}`
  }

  const ok = validator(value)

  if (ok !== true) {
    throw new ValidationError(`${value} failed validation for: "${key}"`)
  }
}

/**
 * Find a validator that matches `key`, run it with the passed `value`, throw on failure
 * Never throw on `null` value
 * @param {Mixed} value the value to check
 * @param {String} key the validator key to check against
 * @throws A validator matching the passed key must exist and return true
 */
module.exports.beSureAllowNull = (value, key) => {
  const validator = getValidator(key)

  if(typeof validator !== 'function') {
    throw `No validator found for key: ${key}`
  }

  if(value === null) {
    return true
  }

  const ok = validator(value)

  if (ok !== true) {
    throw new ValidationError(`${value} failed validation for: "${key}"`)
  }
}

module.exports.setValidator = setValidator