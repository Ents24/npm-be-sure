const ValidationError = require('../src/validation-error')
const { beSure, beSureAllowNull } = require('../index.js')

// A valid custom error class
class CustomError extends Error{}

// An invalid custom error class
class CustomBigInt extends BigInt{}

test('Valid custom error types are thrown', () => {
  expect( () => beSure(0, 'string', Error)).toThrow(Error)
  expect( () => beSure(0, 'string', Error, 'boourns')).toThrow(Error)
  expect( () => beSure(0, 'string', RangeError)).toThrow(RangeError)
  expect( () => beSure(0, 'string', RangeError, 'boourns')).toThrow(RangeError)
  expect( () => beSure(0, 'string', CustomError)).toThrow(CustomError)
  expect( () => beSure(0, 'string', CustomError, 'boourns')).toThrow(CustomError)
  expect( () => beSureAllowNull(0, 'string', Error, 'boourns')).toThrow(Error)
  expect( () => beSureAllowNull(0, 'string', RangeError)).toThrow(RangeError)
  expect( () => beSureAllowNull(0, 'string', RangeError, 'boourns')).toThrow(RangeError)
  expect( () => beSureAllowNull(0, 'string', CustomError)).toThrow(CustomError)
  expect( () => beSureAllowNull(0, 'string', CustomError, 'boourns')).toThrow(CustomError)
})

test('Invalid custom error types ignored', () => {
  expect( () => beSure(0, 'string', CustomBigInt)).toThrow(ValidationError)
  expect( () => beSure(0, 'string', CustomBigInt, 'boourns')).toThrow(ValidationError)
  expect( () => beSureAllowNull(0, 'string', CustomBigInt)).toThrow(ValidationError)
  expect( () => beSureAllowNull(0, 'string', CustomBigInt, 'boourns')).toThrow(ValidationError)
})

test('Custom error text is used', () => {
  expect( () => beSure(0, 'string', Error, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSure(0, 'string', RangeError, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSure(0, 'string', CustomError, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSure(0, 'string', CustomBigInt, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSureAllowNull(0, 'string', Error, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSureAllowNull(0, 'string', RangeError, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSureAllowNull(0, 'string', CustomError, 'OH NO!')).toThrow('OH NO!')
  expect( () => beSureAllowNull(0, 'string', CustomBigInt, 'OH NO!')).toThrow('OH NO!')
})
