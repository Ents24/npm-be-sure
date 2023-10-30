import { beSureCustom } from '../src/index'
import { setCustomValidators } from '../src/validators'
import ValidationError from '../src/validation-error'

type Cat = {name: string, meows: true, smells: false}
type Dog = {name: string, woofs: true, smells: true}
const myCat:Cat = {name: 'Bill', meows: true, smells: false}
const myDog:Dog = {name: 'Ted', woofs: true, smells: true}

setCustomValidators({
  'cat' : (value:Cat) => {return value.meows === true},
  'dog' : (value:Dog) => {return value.woofs === true}
})

test('Dogs and cats living together! Mass hysteria!', () => {
  expect( () => beSureCustom(myCat, 'cat')).not.toThrow()
  expect( () => beSureCustom(myDog, 'dog')).not.toThrow()
})

test('Bad dog', () => {
  expect( () => beSureCustom(myCat as unknown as  Dog, 'dog')).toThrow(ValidationError)
  expect( () => beSureCustom(true as unknown as  Dog, 'dog')).toThrow(ValidationError)
  expect( () => beSureCustom(false as unknown as  Dog, 'dog')).toThrow(ValidationError)
  expect( () => beSureCustom(8 as unknown as  Dog, 'dog')).toThrow(ValidationError)
})
