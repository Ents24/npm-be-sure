# Be Sure
NPM module for terse, "throwy" validation

A common problem in web apps is where to validate parameters, and how, and what to do on failure. On one hand, it's best if every function validates its params thoroughly. On the other hand validation-in-place can be verbose and make modules harder to read. `beSure` attempts to provide the shortest validation syntax possible to keep code DRY and encourage consistent use by:

1. Being very concise
2. Always **throw**ing on validation failure
3. Applying customisation and handler logic elsewhere

It probably belongs at specific level(s) of an app e.g. "all standalone libs" or "all functions in the state-management layer" - thrown errors are therefore anticipated at that level and error handling is applied higher up.

 ## BEFORE - verbose, boilerplate, hard to read

```js
UPDATE_USER_ACTION(userId, userName, dateOfBirth){

  if (typeof userId !== 'number' || userId != == toInteger(value)) {
    throw 'Invalid userId: ' + userId;
  }

  if (typeof userName !== 'string' || userName.length < 5) {
    throw 'Invalid userName: ' + userName;
  }

  if (dateOfBirth instanceof Date !== true || dateOfBirth < new Date()) {
    throw 'Invalid dateOfBirth: ' + dateOfBirth;
  }

  // function body ...

}
```

 ## AFTER - terse, consistent

```js
UPDATE_USER_ACTION(userId, userName, dateOfBirth){

    beSure(userId, 'id')
    beSure(userName, 'string-not-empty')
    beSure(dateOfBirth, 'date-in-past')

  // function body ...

}
```

## Simple Use

Require and use basic validators

```js
const { beSure } = require('@ents24/be-sure')
beSure(myParam, 'slug')
```

## Custom Use

Provide your own validator or redefine existing ones via a wrapper module (see [custom.js](tests/custom.js) for example)

In `./libs/be-sure-custom.js`

```js
const beSureCustom = require('@ents24/be-sure')

// Add a new validator
const catCheck = value => typeof value === 'object' && value.says === 'meow'
beSureCustom.setValidator('cat', catCheck)

// Redefine 'int' validator - allow anything up to MAX_SAFE_INTEGER
const maxSafeIntegerCheck = value => {
  if (typeof value !== 'number' || value !== parseInt(value, 10)) {
    return false
  }

  if (value > Number.MAX_SAFE_INTEGER) {
    return false
  }

  return true
}

beSureCustom.setValidator('int', maxSafeIntegerCheck)

module.exports = beSureCustom;
```

In `./lib/various-animal-utils.js`

```js
const { beSure } = require('./lib/beSureCustom');

const cat = {
  name: 'Colin',
  says: 'meow'
}
const dog = {
  name: 'Michael',
  says: 'woof'
}

// ✓ No problem
beSure(cat, 'cat')

// ✗ ValidationError: [object Object] failed validation for "cat"
beSure(dog, 'cat')

const maxSignedInt32 = 2147483647

// ✓ Int above 32 bit now valid
beSure(maxSignedInt32 + 100, 'int')
```