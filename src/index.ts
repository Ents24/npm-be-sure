import ValidationError from './validation-error'
import {getValidator, getCustomValidator, BeSureKey } from './validators'

/**
 * Find a validator that matches `key`, run it with the passed `value`, throw on failure
 * @param {Mixed} value the value to check
 * @param {String} key the validator key to check against
 * @param {any} errorType a type that extends Error
 * @param {String | undefined} errorText the text to include if an error is thrown
 * @throws A validator matching the passed key must exist and return true
 */
export function beSure (value:any, key: BeSureKey, errorType?:any, errorText?:string): void {
  const validator = getValidator(key)

  if(typeof validator !== 'function') {
    throw `No validator found for key: ${key}`
  }

  if (validator(value) === false) {
    fail(value, key, errorType, errorText)
  }
}

/**
 * Find a validator that matches `key`, run it with the passed `value`, throw on failure
 * Never throw on `null` value
 * @param {Mixed} value the value to check
 * @param {String} key the validator key to check against
 * @param {any} errorType a type that extends Error
 * @param {String | undefined} errorText the text to include if an error is thrown
 * @throws A validator matching the passed key must exist and return true
 */
export function beSureAllowNull (value:any, key:BeSureKey, errorType?:any, errorText?:string): void {
  if (value !== null) {
    beSure(value, key, errorType, errorText)
  }
}

export function beSureCustom(value: any, customKey:string, errorType?:any, errorText?:string) {
  const validator = getCustomValidator(customKey)

  if(typeof validator !== 'function') {
    throw `No validator found for key: ${customKey}`
  }

  if (validator(value) === false) {
    fail(value, customKey, errorType, errorText)
  }

}

function fail(value:any, key:string, errorType?:any, errorText?:string): void {
  // Apply errorText or default error text
  if (typeof errorText !== 'string') {
    errorText = `${decorateValue(value)} failed validation for: ${key}`
  }

  // Throw errorType or default ValidationError
  if (typeof errorType === 'function' && errorType.prototype instanceof Error) {
    throw new errorType(errorText)
  }

  throw new ValidationError(errorText)
}


/**
 * Decorate a value to make log output more readable. Currently just wraps
 * strings in quotes
 */
const decorateValue = (value: any): string => typeof value === 'string' ?  `'${value}'` : value
