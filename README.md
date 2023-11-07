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
`cd dist && cp -f ../package.json . && cp -f ../README_NPM.md ./README.md && cp -f ../LICENSE .`

Custom script called as part of `publishDist` below to move required non-build assets into the `/dist` folder. Note the `cd` first, so that the cmd fails immediately if `/dist` has not been built. The simpler version: `cp -f package.json dist` would just copy `package.json` to a new file called `dist`, which could be v confusing.

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