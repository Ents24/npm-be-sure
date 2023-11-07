# Be Sure
NPM module for terse, "throwy" runtime validation. Extremely lightweight, zero dependency, with TypeScript support.

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
Import and use basic validators

```js
import { beSure } from '@ents24/be-sure'
beSure(myParam, 'slug')
```

## Custom Error Class / Text
Include an error type to instantiate and throw where needed

```js
import { beSure } from '@ents24/be-sure'
class MySpecificError extends Error {}

// Type only
beSure(myParam, 'slug', MySpecificError)

// Or include text, too
beSure(myParam, 'slug', MySpecificError, 'My specific message')
```

## Custom Use
Provide your own key / validator combinations for later use (see [custom.js](tests/customValidator.test.ts) for examples)
