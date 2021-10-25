# Storeon Solid.js

[![npm version](https://badge.fury.io/js/%40storeon%2Fsolidjs.svg)](https://www.npmjs.com/package/@storeon/solidjs)
[![Build Status](https://travis-ci.org/storeon/solidjs.svg?branch=master)](https://travis-ci.org/storeon/solidjs)

<img src="https://storeon.github.io/storeon/logo.svg" align="right" alt="Storeon logo by Anton Lovchikov" width="160" height="142">

[Solid.js] a declarative, efficient, and flexible JavaScript library for building user interfaces. `@storeon/solidjs` package helps to connect store with Solid.js to provide a better performance and developer experience while remaining so tiny.

- **Size**. 200 bytes (+ Storeon itself) instead of ~3kB of Redux (minified and gzipped).
- **Ecosystem**. Many additional [tools] can be combined with a store.
- **Speed**. It tracks what parts of state were changed and re-renders only components based on the changes.

[storeon]: https://github.com/storeon/storeon
[tools]: https://github.com/storeon/storeon#tools
[solid.js]: https://github.com/ryansolid/solid
[size limit]: https://github.com/ai/size-limit
[article]: https://evilmartians.com/chronicles/storeon-redux-in-173-bytes

## Install
```sh
npm install -S @storeon/solidjs
```
or
```sh
yarn add @storeon/solidjs
```
## How to use

Create store using `storeon` module:

#### `store.js`

```javascript
import { createStoreon } from 'storeon'

let counter = store => {
  store.on('@init', () => ({ count: 0 }))
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

export const store = createStoreon([counter])
```

#### `main.js`

Provide store using `StoreonProvider` from `@storeon/solidjs`:

```js
import { render } from 'solid-js/web'
import { StoreonProvider } from '@storeon/solidjs'
import { store } from './store'

render(
  <StoreonProvider store={store}>
    <App />
  </StoreonProvider>,
  document.body
)
```

Import `useStoreon` decorator from `@storeon/solidjs`:

#### `Counter.jsx`

```js
import { useStoreon } from '@storeon/solidjs'

export default function Counter() {
  const [state, dispatch] = useStoreon()

  return (
    <div>
      {state.count}
      <button onClick={() => dispatch('inc')}>inc</button>
    </div>
  )
}
```

## Using with TypeScript

#### `Counter.tsx`

```js
import { useStoreon } from '@storeon/solidjs'
import { State, Events } from './store'

export default function Counter() {
  const [state, dispatch] = useStoreon<State, Events>()

  return (
    <div>
      {state.count}
      <button onClick={() => dispatch('inc')}>inc</button>
    </div>
  )
}
```