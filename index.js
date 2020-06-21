const {
  reconcile,
  createState,
  createContext,
  useContext,
  onCleanup
} = require('solid-js')
const { createComponent } = require('solid-js/dom')

const StoreContext = createContext()

function StoreonProvider (props) {
  if (process.env.NODE_ENV !== 'production' && !props.store) {
    throw new Error(
      'Could not find store in props. ' +
        'Please ensure that you pass store to the provider ' +
        '<StoreonProvider store={store}>'
    )
  }

  let [state, setState] = createState(props.store.get())

  let undind = props.store.on('@changed', (_, changed) => {
    Object.keys(changed).forEach(key => {
      setState(key, reconcile(changed[key]))
    })
  })
  onCleanup(() => undind())

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
