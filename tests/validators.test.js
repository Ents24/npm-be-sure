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

const IntegerTest = key => {
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

const positiveIntegerTest = key => {

  IntegerTest(key)

  expect( () => beSure(0, key)).toThrow(ValidationError)
  expect( () => beSure(-0, key)).toThrow(ValidationError)
  expect( () => beSure(-1, key)).toThrow(ValidationError)
  expect( () => beSure(-10, key)).toThrow(ValidationError)
  expect( () => beSure(-999999, key)).toThrow(ValidationError)
  expect( () => beSure(-0o51, key)).toThrow(ValidationError)
}

test('id validator', () => positiveIntegerTest('id'))
test('int validator', () => IntegerTest('int'))
test('int+ validator', () => positiveIntegerTest('int+'))
test('page validator', () => positiveIntegerTest('page'))

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

test('custom validator', () => {
  expect( () => beSure(true, 'slug')).toThrow(ValidationError)
})
