<div align="center">
<h1>jest-expect-message</h1>

🃏🗯

Add custom message to Jest expects

</div>

<hr />

[![version](https://img.shields.io/npm/v/jest-expect-message.svg?style=flat-square)](https://www.npmjs.com/package/jest-expect-message)
[![MIT License](https://img.shields.io/npm/l/jest-expect-message.svg?style=flat-square)](https://github.com/jason0x43/jest-expect-message/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**Note:** This is a fork of [mattphillips/jest-expect-message](https://github.com/mattphillips/jest-expect-message) with TS source and updates for Jest 27.

## Problem

In many testing libraries it is possible to supply a custom message for a given expectation, this is currently not
possible in Jest.

For example:

```js
test('returns 2 when adding 1 and 1', () => {
  expect(1 + 1, 'Woah this should be 2!').toBe(3);
});
```

This will throw the following error in Jest:

```sh
Expect takes at most one argument.
```

## Solution

`jest-expect-message` allows you to call `expect` with a second argument of a `String` message.

For example the same test as above:

```js
test('returns 2 when adding 1 and 1', () => {
  expect(1 + 1, 'Woah this should be 2!').toBe(3);
});
```

With `jest-expect-message` this will fail with your custom error message:

```sh
  ● returns 2 when adding 1 and 1

    Custom message:
      Woah this should be 2!

    expect(received).toBe(expected) // Object.is equality

    Expected: 3
    Received: 2
```

## Installation

With npm:

```sh
npm install --save-dev jest-expect-message
```

With yarn:

```sh
yarn add -D jest-expect-message
```

## Setup

Add `jest-expect-message` to your Jest `setupFilesAfterEnv` configuration.
[See for help](https://jestjs.io/docs/en/next/configuration#setupfilesafterenv-array)

### Jest v24+

```json
"jest": {
  "setupFilesAfterEnv": ["jest-expect-message"]
}
```

### Jest v23-

```json
"jest": {
  "setupTestFrameworkScriptFile": "jest-expect-message"
}
```

## Usage

- `expect(actual, message)`
  - `actual`: The value you would normally pass into an `expect` to assert against with a given matcher.
  - `message`: String, the custom message you want to be printed should the `expect` fail.

```js
test('returns 2 when adding 1 and 1', () => {
  expect(1 + 1, 'Woah this should be 2!').toBe(3);
});
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/5610087?v=4" width="100px;"/><br /><sub><b>Matt Phillips</b></sub>](http://mattphillips.io)<br />[💻](https://github.com/mattphillips/jest-expect-message/commits?author=mattphillips "Code") [📖](https://github.com/mattphillips/jest-expect-message/commits?author=mattphillips "Documentation") [💡](#example-mattphillips "Examples") [🤔](#ideas-mattphillips "Ideas, Planning, & Feedback") [🚇](#infra-mattphillips "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/mattphillips/jest-expect-message/commits?author=mattphillips "Tests") [🔧](#tool-mattphillips "Tools") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

## LICENSE

[MIT](/LICENSE)
