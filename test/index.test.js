const { createRoot } = require('solid-js')
const { createComponent, render, template, insert } = require('solid-js/dom')
const { createStoreon } = require('storeon')

const { useStoreon, StoreonProvider } = require('..')

it('should provide store', () => {
  let storeon
  function Element () {
    storeon = useStoreon()
    return null
  }
  let store = createStoreon([increment])
  init(store, () => createComponent(Element))

  expect(storeon[0].count).toEqual(store.get().count)
  expect(storeon[0].started).toEqual(store.get().started)
  expect(storeon[1]).toBe(store.dispatch)
})

it('should re-render on store changes', () => {
  function Element () {
    let [state] = useStoreon()

    let el = template('<div></div>')
    insert(el, () => state.count)
    return el
  }

  let store = createStoreon([increment])
  let wrapper = init(store, () => createComponent(Element))

  expect(wrapper.textContent).toBe('0')
  store.dispatch('inc')
  expect(wrapper.textContent).toBe('1')

  wrapper.innerHTML = ''
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
  return renderIntoContainer(() => createComponent(StoreonProvider, {
    store,
    children
  }))
}

function increment (store) {
  store.on('@init', () => ({ count: 0, started: true }))
  store.on('inc', state => ({ count: state.count + 1 }))
}

function renderIntoContainer (component) {
  let container = document.createElement('div')
  render(component, container)
  return container
}
