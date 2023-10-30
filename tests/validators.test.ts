import ValidationError from '../src/validation-error'
import { beSure, beSureAllowNull } from '../src/index'
import { BeSureKey } from '../src/validators'

/**
 * Run a set of specific array tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
const standardArrayTests = (key:BeSureKey) => {
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

test('array validator allow null', () => {
  expect( () => beSureAllowNull(null, 'array')).not.toThrow()
  expect( () => beSureAllowNull([], 'array')).not.toThrow()
  expect( () => beSureAllowNull(5, 'array')).toThrow()
  expect( () => beSureAllowNull('a string', 'array')).toThrow()
  expect( () => beSureAllowNull(undefined, 'array')).toThrow()
})

test('array-not-empty validator allow null', () => {
  expect( () => beSureAllowNull(null, 'array-not-empty')).not.toThrow()
  expect( () => beSureAllowNull([], 'array-not-empty')).toThrow()
  expect( () => beSureAllowNull(5, 'array-not-empty')).toThrow()
  expect( () => beSureAllowNull('a string', 'array-not-empty')).toThrow()
  expect( () => beSureAllowNull(undefined, 'array-not-empty')).toThrow()
})

/**
 * Run a set of specific integer tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
const standardIntegerTests = (key:BeSureKey) => {
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
const positiveIntegerTests = (key:BeSureKey) => {
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

test('id, int, int+ validators allow null', () => {
  expect( () => beSureAllowNull(null, 'id')).not.toThrow()
  expect( () => beSureAllowNull(1, 'id')).not.toThrow()
  expect( () => beSureAllowNull(0, 'id')).toThrow()
  expect( () => beSureAllowNull(null, 'int')).not.toThrow()
  expect( () => beSureAllowNull(1, 'int')).not.toThrow()
  expect( () => beSureAllowNull(0, 'int')).not.toThrow()
  expect( () => beSureAllowNull('0', 'int')).toThrow()
  expect( () => beSureAllowNull(null, 'int+')).not.toThrow()
  expect( () => beSureAllowNull(1, 'int+')).not.toThrow()
  expect( () => beSureAllowNull(0, 'int+')).toThrow()
})

/**
 * Run a set of specific string tests for the given validator key
 * @param {string} key the validator key to run all tests against
 */
const standardStringTests = (key:BeSureKey) => {
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
 const standardSlugTests = (key:BeSureKey) => {
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

test('missing validator', () => {
  expect( () => beSure(1, 'not-a-validator-key' as BeSureKey)).toThrow()
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

test('bool validator allow null', () => {
  expect( () => beSureAllowNull(null, 'bool')).not.toThrow()
  expect( () => beSureAllowNull(true, 'bool')).not.toThrow()
  expect( () => beSureAllowNull(1, 'bool')).toThrow()
})

test('defined validator', () => {
  var aVariable = 'Some text'

  // Good...
  expect( () => beSure(aVariable, 'defined')).not.toThrow()
  expect( () => beSure(null, 'defined')).not.toThrow()
  expect( () => beSure(true, 'defined')).not.toThrow()
  expect( () => beSure(false, 'defined')).not.toThrow()
  expect( () => beSure(1, 'defined')).not.toThrow()
  expect( () => beSure('Do a flip!', 'defined')).not.toThrow()
  expect( () => beSure([], 'defined')).not.toThrow()
  expect( () => beSure({}, 'defined')).not.toThrow()

  // Bad...
  const aVariableThatIsUndefined = undefined
  expect( () => beSure(aVariableThatIsUndefined, 'defined')).toThrow()
  expect( () => beSure(undefined, 'defined')).toThrow()
})

test('defined validator allow null', () => {
  expect( () => beSureAllowNull(null, 'defined')).not.toThrow()
  expect( () => beSureAllowNull(1, 'defined')).not.toThrow()
  expect( () => beSureAllowNull(null, 'defined')).not.toThrow()
  expect( () => beSureAllowNull(undefined, 'defined')).toThrow()

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
 const standardObjectTests = (key:BeSureKey) => {
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

test('object, object-not-empty validator allow null', () => {
  expect( () => beSureAllowNull(null, 'object')).not.toThrow()
  expect( () => beSureAllowNull({}, 'object')).not.toThrow()
  expect( () => beSureAllowNull(1, 'object')).toThrow()
  expect( () => beSureAllowNull(null, 'object-not-empty')).not.toThrow()
  expect( () => beSureAllowNull({'key': 'value'}, 'object-not-empty')).not.toThrow()
  expect( () => beSureAllowNull({}, 'object-not-empty')).toThrow()
  expect( () => beSureAllowNull(1, 'object-not-empty')).toThrow()
})

test('page validator', () => positiveIntegerTests('page'))

test('page validator allow null', () => {
  expect( () => beSureAllowNull(null, 'page')).not.toThrow()
  expect( () => beSureAllowNull(1, 'page')).not.toThrow()
  expect( () => beSureAllowNull('1', 'page')).toThrow()
})

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

test('name, slug, string, string-not-empty, validators allow null', () => {
  expect( () => beSureAllowNull(null, 'name')).not.toThrow()
  expect( () => beSureAllowNull('hello', 'name')).not.toThrow()
  expect( () => beSureAllowNull(1, 'name')).toThrow()
  expect( () => beSureAllowNull(null, 'slug')).not.toThrow()
  expect( () => beSureAllowNull('hello', 'slug')).not.toThrow()
  expect( () => beSureAllowNull(1, 'slug')).toThrow()
  expect( () => beSureAllowNull(null, 'string')).not.toThrow()
  expect( () => beSureAllowNull('hello', 'string')).not.toThrow()
  expect( () => beSureAllowNull(1, 'string')).toThrow()
  expect( () => beSureAllowNull(null, 'string-not-empty')).not.toThrow()
  expect( () => beSureAllowNull('hello', 'string-not-empty')).not.toThrow()
  expect( () => beSureAllowNull(1, 'string-not-empty')).toThrow()
})

test('string values are decorated correctly', () => {
  try {
    beSure('', 'string-not-empty')
  } catch (e: any) {
    expect(e.message).toBe("'' failed validation for: string-not-empty")
  }

  try {
    beSure(' ', 'string-not-empty')
  } catch (e: any) {
    expect(e.message).toBe("' ' failed validation for: string-not-empty")
  }
})