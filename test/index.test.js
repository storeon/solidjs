import'@testing-library/jest-dom'
import { createRoot, createComponent } from 'solid-js'
import { render, fireEvent } from 'solid-testing-library'
import { createStoreon } from 'storeon'

import { useStoreon, StoreonProvider } from '..'

it('should provide store', () => {
  let storeon
  function Element () {
    storeon = useStoreon()
    return null
  }
  let store = createStoreon([increment])
  init(store, () => <Element />)

  expect(storeon[0].count).toEqual(store.get().count)
  expect(storeon[0].started).toEqual(store.get().started)
  expect(storeon[1]).toBe(store.dispatch)
})

it('should re-render on store changes', () => {
  function Element () {
    let [state, dispatch] = useStoreon()

    return (
      <>
        <span>{state.count}</span>
        <button role="button" onClick={() => dispatch('inc')} />
      </>
    )
  }

  let store = createStoreon([increment])
  let { getByText, getByRole } = init(store, () => <Element />)
  let button = getByRole('button')

  expect(getByText(/0/)).toBeInTheDocument()
  fireEvent.click(button)
  expect(getByText(/1/)).toBeInTheDocument()
})

it('should unbind on cleanup', () => {
  let store = createStoreon([increment])
  let distosed = () => {}
  let on = store.on

  // Keep track of unsubscribe by wrapping on()
  let unsubscribeCalls = 0
  store.on = (event, listener) => {
    let unbind = on(event, listener)
    return () => {
      unsubscribeCalls++
      return unbind()
    }
  }

  createRoot(distose => {
    distosed = distose
    createComponent(StoreonProvider, {
      store,
      children: () => null
    })
  })

  expect(unsubscribeCalls).toBe(0)
  distosed()
  expect(unsubscribeCalls).toBe(1)
})

it('throws if there is no StoreProvider', () => {
  function Button () {
    let hooks = useStoreon()
    return hooks
  }

  expect(() => createComponent(Button)).toThrow(Error)
})

it('throws if store is not passed to the StoreProvider', () => {
  expect(() => createComponent(StoreonProvider, {
    children: () => null
  })).toThrow(Error)
})

function init (store, children) {
  return render(<StoreonProvider store={store} children={children} />)
}

function increment (store) {
  store.on('@init', () => ({ count: 0, started: true }))
  store.on('inc', state => ({ count: state.count + 1 }))
}
