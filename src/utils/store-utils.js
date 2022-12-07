export function createStore(reducer) {
  let state = reducer(undefined, { type: '@@INIT' })
  let listeners = []

  return {
    getState() {
      return state
    },
    dispatch(action) {
      state = reducer(state, action)
      listeners.forEach((listener) => listener())
    },
    subscribe(listener) {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter((l) => l !== listener)
      }
    },
  }
}

export function createAction(type) {
  const action = (payload) => ({ type, payload })
  action.toString = () => type
  return action
}

export function createReducer(initialState, handlers) {
  return (state = initialState, action) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
