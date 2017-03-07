# vitruvius [![Build Status](https://travis-ci.org/thomashuston/vitruvius.svg?branch=master)](https://travis-ci.org/thomashuston/vitruvius) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/5prw8lfj8vvetdp7/branch/master?svg=true)](https://ci.appveyor.com/project/thomashuston/vitruvius/branch/master) [![npm version](https://badge.fury.io/js/vitruvius.svg)](http://badge.fury.io/js/vitruvius)

Master builder for [Lerna](https://lernajs.io/) projects.

- Transpile source code with Babel, excluding tests
- Copy non-JS assets to the output directory

<img src="docs/img/vitruvius.png" width="100">

## Getting Started

Install vitruvius using `npm`:

```sh
npm install --save-dev vitruvius
```

Next add a simple `npm` script to run vitruvius:

```json
"scripts": {
    "build": "vitruvius build --src src --dest lib"
}
```

Now, running `npm run build` will look in the `src` directory of each package in your project and output the compiled code in a `lib` folder in each package.

## Usage

```sh
vitruvius build --src <srcDirName> --dest <destDirName> [--ignore <fileGlobPatterns>]
```

`src` (required) is the name of the source directory within each package.

`dest` (required) is the name of the output directory you want to create in each package.

`ignore` (optional) is an array of glob patterns for files and directories to ignore. By default, `*.test.js`, `*.spec.js`, `**/__tests__/**`, and `**/__mocks__/**` are ignored.

As a point of reference, let's consider this standard Lerna project:

```
my-lerna-repo/
  packages/
    package-1/
      src/
        index.spec.js
        index.js
      package.json
    package-2/
      src/
        data.json
        index.js
      package.json
```

Let's say we want to compile the source code in `package-1` and `package-2` into a `lib` folder.

To do this, we can run `vitruvius build --src src --dest lib`. This will Babel compile the source code, copy any non-JS files, and ignore test files.

After building, our project now looks like this:

```
my-lerna-repo/
  packages/
    package-1/
      lib/
        index.js
      src/
        index.spec.js
        index.js
      package.json
    package-2/
      lib/
        data.json
        index.js
      src/
        data.json
        index.js
      package.json
```

As you can see, `package-1/src/index.js` has been compiled into `package-1/lib/index.js`, while `package-1/src/index.spec.js` was ignored. And `package-2/src/data.json` was copied over to `package-2/lib/data.json`, along with `package-2/src/index.js` being compiled to `package-2/lib/index.js`.
