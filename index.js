const {
  createContext,
  useContext,
  onCleanup,
  createComponent
} = require('solid-js')
const { createStore, reconcile } = require('solid-js/store')

const StoreContext = createContext()

function StoreonProvider (props) {
  if (process.env.NODE_ENV !== 'production' && !props.store) {
    throw new Error(
      'Could not find store in props. ' +
        'Please ensure that you pass store to the provider ' +
        '<StoreonProvider store={store}>'
    )
  }

  let [state, setState] = createStore(props.store.get())

  let unbind = props.store.on('@changed', (_, changed) => {
    Object.keys(changed).forEach(key => {
      setState(key, reconcile(changed[key]))
    })
  })
  onCleanup(() => unbind())

  return createComponent(StoreContext.Provider, {
    value: [state, props.store.dispatch],
    children: () => props.children
  })
}

function useStoreon () {
  let store = useContext(StoreContext)

  if (process.env.NODE_ENV !== 'production' && !store) {
    throw new Error(
      'Could not find storeon context value. ' +
        'Please ensure the component is wrapped in a <StoreonProvider>'
    )
  }

  return store
}

module.exports = { StoreonProvider, useStoreon }
