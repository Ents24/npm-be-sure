const ValidationError = require('../src/validation-error')
const { beSure } = require('./customValidator.js')

const cat = {
  name: 'Colin',
  says: 'meow'
}

const dog = {
  name: 'Michael',
  says: 'woof'
}

test('Cats are OK', () => {
  expect( () => beSure(cat, 'cat')).not.toThrow()
})

test('Dogs are a bit stinky', () => {
  expect( () => beSure(dog, 'cat')).toThrow(ValidationError)
})

test('Integer over 32 bit is now OK', () => {
  const maxSignedInt32 = 2147483647
  expect( () => beSure(maxSignedInt32 + 100, 'int')).not.toThrow(ValidationError)
})

test('Non-integer is still invalid', () => {
  expect( () => beSure(dog, 'int')).toThrow(ValidationError)
})