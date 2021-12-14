const ValidationError = require('../src/validation-error')
const { beSure } = require('../index.js')

test('invalid calls', () => {
  expect( () => beSure()).toThrow()
  expect( () => beSure(1)).toThrow()
  expect( () => beSure(1,2)).toThrow()
  expect( () => beSure('moose')).toThrow()
  expect( () => beSure(true)).toThrow()
  expect( () => beSure(1, 'not-a-validator-key')).toThrow()
})

/**
 * Run a set of specific integer tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
const standardIntegerTests = key => {
  // Good...
  expect( () => beSure(1, key)).not.toThrow()
  expect( () => beSure(10, key)).not.toThrow()
  expect( () => beSure(999999, key)).not.toThrow()
  expect( () => beSure(0o51, key)).not.toThrow()

  // Bad...
  expect( () => beSure(2147483647+1, key)).toThrow(ValidationError) // maxSignedInt32+1
  expect( () => beSure('1', key)).toThrow(ValidationError)
  expect( () => beSure('howdy doodly do', key)).toThrow(ValidationError)
  expect( () => beSure(true, key)).toThrow(ValidationError)
}

/**
 * Run a set of specific positive integer tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
const positiveIntegerTests = key => {

  standardIntegerTests(key)

  expect( () => beSure(0, key)).toThrow(ValidationError)
  expect( () => beSure(-0, key)).toThrow(ValidationError)
  expect( () => beSure(-1, key)).toThrow(ValidationError)
  expect( () => beSure(-10, key)).toThrow(ValidationError)
  expect( () => beSure(-999999, key)).toThrow(ValidationError)
  expect( () => beSure(-0o51, key)).toThrow(ValidationError)
}

/**
 * Run a set of specific string tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
const standardStringTests = key => {
  // Good
  expect( () => beSure('Plankton', key)).not.toThrow()

  // Bad
  expect( () => beSure(true, key)).toThrow(ValidationError)
  expect( () => beSure(false, key)).toThrow(ValidationError)
  expect( () => beSure(0, key)).toThrow(ValidationError)
  expect( () => beSure(1, key)).toThrow(ValidationError)
}

test('id validator', () => positiveIntegerTests('id'))
test('int validator', () => standardIntegerTests('int'))
test('int+ validator', () => positiveIntegerTests('int+'))

test('name validator', () => {
  standardStringTests('name')

  // Good...
  expect( () => beSure('_', 'name')).not.toThrow()

  // Bad...
  expect( () => beSure('', 'name')).toThrow(ValidationError)
  expect( () => beSure('    ', 'name')).toThrow(ValidationError)
  expect( () => beSure('-', 'name')).toThrow(ValidationError)
  expect( () => beSure('- - ', 'name')).toThrow(ValidationError)
  expect( () => beSure('&', 'name')).toThrow(ValidationError)
  expect( () => beSure(' & ', 'name')).toThrow(ValidationError)
  expect( () => beSure(' ^ ', 'name')).toThrow(ValidationError)
  expect( () => beSure(' * ', 'name')).toThrow(ValidationError)
})

test('page validator', () => positiveIntegerTests('page'))

test('slug validator', () => {
  // Good...
  expect( () => beSure('1', 'slug')).not.toThrow()
  expect( () => beSure('a', 'slug')).not.toThrow()
  expect( () => beSure('bjork-with-15-piece-chamber-ensemble', 'slug')).not.toThrow()

  // Bad...
  expect( () => beSure('', 'slug')).toThrow(ValidationError)
  expect( () => beSure('björk-with-15-piece-chamber-ensemble', 'slug')).toThrow(ValidationError)
  expect( () => beSure(0, 'slug')).toThrow(ValidationError)
  expect( () => beSure(1, 'slug')).toThrow(ValidationError)
  expect( () => beSure(true, 'slug')).toThrow(ValidationError)
})

test('string validator', () => {
  standardStringTests('string')
})

test('string-not-empty validator', () => {
  standardStringTests('string-not-empty')
  expect( () => beSure('', 'string-not-empty')).toThrow(ValidationError)
})
