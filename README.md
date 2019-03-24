# Butterfly

## Description

Express API Framework

## Getting started

Make sure you have [npx](https://www.npmjs.com/package/npx) installed (`npx` is shipped by default since [npm](https://www.npmjs.com/get-npm) `5.2.0`)

```bash
npx create-butterfly-app <my-project>
```

Or starting with npm v6.1 you can do:

```bash
npm init butterfly-app <my-project>
```

Or with [yarn](https://yarnpkg.com/en/):

```bash
yarn create butterfly-app <my-project>
```

It's as simple as that!

## Using Butterfly programmatically

```js
import Butterfly from '@iredium/butterfly'
import config from './config'

const butterfly = new Butterfly(config)

butterfly.boot()

// You can interact with the express app instance using butterfly.app
```
