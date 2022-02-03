const ValidationError = require('../src/validation-error')
const { beSure } = require('../index.js')

/**
 * Run a set of specific array tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
 const standardArrayTests = key => {
  // Good...
  expect( () => beSure([1], key)).not.toThrow()
  expect( () => beSure([1,2,3], key)).not.toThrow()
  expect( () => beSure([{saddle:'goose'}], key)).not.toThrow()

  // Bad...
  expect( () => beSure(1, key)).toThrow(ValidationError)
  expect( () => beSure('a', key)).toThrow(ValidationError)
  expect( () => beSure({}, key)).toThrow(ValidationError)
  expect( () => beSure(null, key)).toThrow(ValidationError)
}

test('array validator', () => {
  standardArrayTests('array')
  // This is fine...
  expect( () => beSure([], 'array')).not.toThrow()
})

test('array-not-empty validator', () => {
  standardArrayTests('array-not-empty')
  // This is not fine...
  expect( () => beSure([], 'array-not-empty')).toThrow()
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

  // Bad...
  expect( () => beSure(0, key)).toThrow(ValidationError)
  expect( () => beSure(-0, key)).toThrow(ValidationError)
  expect( () => beSure(-1, key)).toThrow(ValidationError)
  expect( () => beSure(-10, key)).toThrow(ValidationError)
  expect( () => beSure(-999999, key)).toThrow(ValidationError)
  expect( () => beSure(-0o51, key)).toThrow(ValidationError)
}

test('id validator', () => positiveIntegerTests('id'))
test('int validator', () => standardIntegerTests('int'))
test('int+ validator', () => positiveIntegerTests('int+'))

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

/**
 * Run a set of specific slug tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
 const standardSlugTests = key => {
  // Good...
  expect( () => beSure('1', key)).not.toThrow()
  expect( () => beSure('a', key)).not.toThrow()
  expect( () => beSure('bjork-with-15-piece-chamber-ensemble', key)).not.toThrow()

  // Bad...
  expect( () => beSure('', key)).toThrow(ValidationError)
  expect( () => beSure('björk-with-15-piece-chamber-ensemble', key)).toThrow(ValidationError)
  expect( () => beSure(0, key)).toThrow(ValidationError)
  expect( () => beSure(1, key)).toThrow(ValidationError)
  expect( () => beSure(true, key)).toThrow(ValidationError)
}

test('invalid calls', () => {
  expect( () => beSure()).toThrow()
  expect( () => beSure(1)).toThrow()
  expect( () => beSure(1,2)).toThrow()
  expect( () => beSure('moose')).toThrow()
  expect( () => beSure(true)).toThrow()
  expect( () => beSure(1, 'not-a-validator-key')).toThrow()
})

test('bool validator', () => {
  // Good...
  expect( () => beSure(true, 'bool')).not.toThrow()
  expect( () => beSure(false, 'bool')).not.toThrow()

  // Bad...
  expect( () => beSure(1, 'bool')).toThrow()
  expect( () => beSure('moose I up', 'bool')).toThrow()
  expect( () => beSure([], 'bool')).toThrow()
  expect( () => beSure({}, 'bool')).toThrow()
})

test('defined validator', () => {
  var cliveIsDefined = 'Clive'

  // Good...
  expect( () => beSure(cliveIsDefined, 'defined')).not.toThrow()
  expect( () => beSure(null, 'defined')).not.toThrow()
  expect( () => beSure(true, 'defined')).not.toThrow()
  expect( () => beSure(false, 'defined')).not.toThrow()
  expect( () => beSure(1, 'defined')).not.toThrow()
  expect( () => beSure('Do a flip!', 'defined')).not.toThrow()
  expect( () => beSure([], 'defined')).not.toThrow()
  expect( () => beSure({}, 'defined')).not.toThrow()

  // Bad...
  expect( () => beSure(alanIsUndefined, 'defined')).toThrow()
  expect( () => beSure(undefined, 'defined')).toThrow()
})

test('email validator', () => {
  // Good, borrowed from https://en.wikipedia.org/wiki/Email_address
  expect( () => beSure('a@b.co', 'email')).not.toThrow()
  expect( () => beSure('very.common@example.com', 'email')).not.toThrow()
  expect( () => beSure('disposable.style.email.with+symbol@example.com', 'email')).not.toThrow()
  expect( () => beSure('other.email-with-hyphen@example.com', 'email')).not.toThrow()
  expect( () => beSure('fully-qualified-domain@example.com', 'email')).not.toThrow()
  expect( () => beSure('user.name+tag+sorting@example.com', 'email')).not.toThrow()
  expect( () => beSure('x@example.com', 'email')).not.toThrow()
  expect( () => beSure('example-indeed@strange-example.com', 'email')).not.toThrow()
  expect( () => beSure('example@s.example', 'email')).not.toThrow()
  expect( () => beSure('user%example.com@example.org', 'email')).not.toThrow()
  expect( () => beSure('user-@example.org', 'email')).not.toThrow()

  // Bad...
  expect( () => beSure(1, 'email')).toThrow()
  expect( () => beSure(true, 'email')).toThrow()
  expect( () => beSure([], 'email')).toThrow()
  expect( () => beSure({}, 'email')).toThrow()
  expect( () => beSure('Abc.example.com', 'email')).toThrow() // no @ character
  expect( () => beSure('A@b@c@example.com', 'email')).toThrow() // multiple @ character
})

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


/**
 * Run a set of specific object tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
 const standardObjectTests = key => {
  // Good...
  expect( () => beSure({saddle:'goose'}, key)).not.toThrow()

  // Bad...
  expect( () => beSure(1, key)).toThrow()
  expect( () => beSure('moose I up', key)).toThrow()
  expect( () => beSure([], key)).toThrow()
  expect( () => beSure(null, key)).toThrow()
  expect( () => beSure(true, key)).toThrow()
  expect( () => beSure(false, key)).toThrow()
}

test('object validator', () => {
  standardObjectTests('object')
  // This is fine...
  expect( () => beSure({}, 'object')).not.toThrow()
})

test('object-not-empty validator', () => {
  standardObjectTests('object-not-empty')
  // This is not fine...
  expect( () => beSure({}, 'object-not-empty')).toThrow()
})

test('page validator', () => positiveIntegerTests('page'))

test('slug validator', () => {
  standardSlugTests('slug')

  // Bad...
  expect( () => beSure('UPPERCASE', 'slug')).toThrow(ValidationError)
  expect( () => beSure('UPPERCASE-WITH-DASHES', 'slug')).toThrow(ValidationError)
})

test('slug validator', () => {
  standardSlugTests('slug-mixed')

  // Good...
  expect( () => beSure('UPPERCASE', 'slug-mixed')).not.toThrow()
  expect( () => beSure('UPPERCASE-WITH-DASHES', 'slug-mixed')).not.toThrow()
})

test('string validator', () => {
  standardStringTests('string')
})

test('string-not-empty validator', () => {
  standardStringTests('string-not-empty')

  // Bad...
  expect( () => beSure('', 'string-not-empty')).toThrow(ValidationError)
  expect( () => beSure(null, 'string-not-empty')).toThrow(ValidationError)
})

