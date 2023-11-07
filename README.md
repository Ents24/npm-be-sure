# Be Sure
NPM module for terse, "throwy" runtime validation

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

## Development
### Install dependencies
`npm i`

### Build
`npm run build`

### Build & watch for changes
`npm run watch`

### Test
`npm test`

### Publish - Short Version
1. `npm run build`
2. `npm version <major|minor|patch>`
3. `npm run publishDist`

### Publish - Explanation
Files in this library live in the Git repo, with the exception of built files within `/dist` which is ignored. The npm package is the opposite - it should contain the built contents of the `/dist` directory (JS files and type definitions) plus `package.json`.

`npm publish` operates anywhere it can find a `package.json` file. Running `npm publish` (as standard practice) from the library root would result in the published npm module containing the whole library, which is unnecessary, plus consuming code would need to import `@ents24/be-sure/dist/index` or similar. Which is lame.

Copying `package.json` into `/dist` and then running `npm publish` from that directory ~seems like~ is a hack but will have the desired result.

#### npm script: "copyPackage"
`cd dist && cp -f ../package.json .`

Custom script called as part of `publishDist` below. Note the `cd` first, so that the cmd fails immediately if `/dist` has not been built. The simpler version: `cp -f package.json dist` would just copy `package.json` to a new file called `dist`, which could be v confusing.

The only problem with that solution is that it essentially leaves a trap for unsuspecting devs - the next person to edit the library and run the standard build & publish steps from the library root will accidentally publish the whole library to npm and break import behaviour for all consuming systems. Which would be far from great.

SO, two further npm scripts are used to enforce the desired behaviour:

#### npm script: "prepublishOnly"
`sh -c 'if [ \"${PWD##*/}\" != \"dist\" ]; then echo \"Publish must be run from /dist, see README.md for steps\" && exit 1; fi'`

NPM [prepublish hook script](https://docs.npmjs.com/cli/v10/using-npm/scripts) that is run automatically before `npm publish`. So `npm publish` will fail if it is run from the library root.

#### npm script: "publishDist"
Custom script performs the copy / cd / publish steps.

#### Therefore

To build the required module files, bump the version and publish to npm:
1. `npm run build`
2. `npm version <major|minor|patch>`
3. `npm run publishDist`