const ValidationError = require('./src/validation-error.js');
const { getValidator, setValidator } = require('./src/validators.js');

/**
 * Find a validator that matches `key`, run it with the `value`, throw on failure
 * @param {Mixed} value the value to check
 * @param {String} type the validator tag to check against
 * @returns {Boolean} true if the value passes validation, false otherwise
 * @throws
 */
module.exports.beSure = (value, key) => {
  const validator = getValidator(key);

  if(typeof validator !== 'function') {
    throw `No validator found for key: ${key}`
  }

  const ok = validator(value)

  if (ok !== true) {
    throw new ValidationError(`${value} failed validation for: "${key}"`)
  }
}

module.exports.setValidator = setValidator