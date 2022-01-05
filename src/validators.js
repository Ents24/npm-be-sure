const maxSignedInt32 = 2147483647

const isInt = value => typeof value == 'number' && value == parseInt(value, 10)

const isInt32 = value => isInt(value) && value <= maxSignedInt32

const isPositiveInt32 = value => isInt32(value) && value > 0

const isNonEmptyString = value => typeof value === 'string' && value.length > 0

const isStringWithWordCharacters = value => typeof value === 'string' && !!value.match(/\w/)

const isObject = value => {
  let isNotArray =  Array.isArray(value) === false
  let isNotNull = value !== null
  return typeof value === 'object' && isNotArray && isNotNull
}


/**
 * A set of validator functions accessible by key. Each returns Boolean true
 * .. if the passed value is valid, false otherwise. Note that these
 * .. defaults are opinionated: the "int+" validator also requires the value
 * .. to fit within 32 bit range. Validators can be added or overridden to
 * .. match an app's requirements
 */
 const validators = {
  'array': value => Array.isArray(value),
  'array-not-empty': value => Array.isArray(value) && value.length > 0,
  'bool': value => typeof value == "boolean",
  'id': value => isPositiveInt32(value),
  'int': value => isInt32(value),
  'int+': value => isPositiveInt32(value),
  'name': value => isStringWithWordCharacters(value),
  'object': value => isObject(value),
  'object-not-empty': value => isObject(value) && Object.keys(value).length > 0,
  'page': value => isPositiveInt32(value),
  'slug': value => isNonEmptyString(value) && !!value.match(/^[a-z0-9\-]+$/),
  'slug-mixed': value => isNonEmptyString(value) && !!value.match(/^[a-zA-Z0-9\-]+$/),
  'string': value => typeof value === 'string',
  'string-not-empty': value => isNonEmptyString(value),
}

module.exports.getValidator = (key) => {
  return validators[key]
}

module.exports.setValidator = (key, func) => {
  if(typeof func !== 'function') {
    throw 'No valid function passed'
  }

  if(isNonEmptyString(key) === false) {
    throw 'No valid key passed'
  }

  validators[key] = func
}