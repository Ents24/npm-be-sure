const maxSignedInt32 = 2147483647

const isInt = (value:number) => typeof value == 'number' && Number.isInteger(value)

const isInt32 = (value:number) => isInt(value) && value <= maxSignedInt32

const isPositiveInt32 = (value:number) => isInt32(value) && value > 0

const isNonEmptyString = (value:String) => typeof value === 'string' && value.length > 0

const isStringWithWordCharacters = (value:String) => typeof value === 'string' && !!value.match(/\w/)

const isObject = (value:object) => {
  const isNotArray =  Array.isArray(value) === false
  const isNotNull = value !== null
  return typeof value === 'object' && isNotArray && isNotNull
}

/**
 * Permissive level of email validation enforces the structure _@_._ (with a single "@"" symbol) only
 * @param {String} value
 * @returns Boolean true if `value` matches the permissive email regex
 */
const isEmailPermissive = (value:String) => isNonEmptyString(value) && !!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)

/**
 * All BeSureValidators accept a single value and return a boolean indicating validation outcome
 */
export type BeSureValidator = (value: any) => boolean

export type BeSureKey =
  'array' |
  'array-not-empty' |
  'bool' |
  'email' |
  'id' |
  'int' |
  'int+' |
  'name' |
  'defined' |
  'object' |
  'object-not-empty' |
  'page' |
  'slug' |
  'slug-mixed' |
  'string' |
  'string-not-empty'

/**
 * A set of validator functions accessible by key. Each returns Boolean true
 * .. if the passed value is valid, false otherwise. Note that these
 * .. defaults are opinionated: the "int+" validator also requires the value
 * .. to fit within 32 bit range. Validators can be added or overridden to
 * .. match an app's requirements
 */
const coreValidators:{[key in BeSureKey]: BeSureValidator} = {
  'array': (value: Array<any>) => Array.isArray(value),
  'array-not-empty': (value: Array<any>) => Array.isArray(value) && value.length > 0,
  'bool': (value: boolean) => typeof value === "boolean",
  'email': isEmailPermissive,
  'id': isPositiveInt32,
  'int': isInt32,
  'int+': isPositiveInt32,
  'name': isStringWithWordCharacters,
  'defined': (value: any) => typeof value !== 'undefined',
  'object': (value: object) => isObject(value),
  'object-not-empty': (value: object) => isObject(value) && Object.keys(value).length > 0,
  'page': isPositiveInt32,
  'slug': (value: string) => isNonEmptyString(value) && !!value.match(/^[a-z0-9\-]+$/),
  'slug-mixed': (value: string) => isNonEmptyString(value) && !!value.match(/^[a-zA-Z0-9\-]+$/),
  'string': (value: string) => typeof value === 'string',
  'string-not-empty': isNonEmptyString,
}

export function getValidator(key: BeSureKey):BeSureValidator {
  return coreValidators[key]
}

export type CustomValidators = {[key: string]: BeSureValidator};

let customValidators: {[key: string]: BeSureValidator } = {}

/**
 *
 * @param {string} key the key used to refer to the new validator
 * @param {BeSureValidator} func the validator function
 */
export function setCustomValidators(cvs: CustomValidators): void {
  customValidators = cvs
}

/**
 *
 * @param {string} key the key to seek in coreValidators and customValidators
 * @returns {BeSureValidator} function if a match is found
 */
export function getCustomValidator(key: string): BeSureValidator | undefined {
  return customValidators[key]
}
